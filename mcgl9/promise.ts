import {setTimeout} from './timers';

type Handler<T, R = any> = (val: T) => R;
type FulfillHandler<T, R = any> = (err: boolean, val: T) => R;
type UnwrappedResult<T> = T extends MPromise<infer T2> ? T2 : T;

export default class MPromise<T = any> {
	private done: boolean = false;
	private error: boolean = false;
	private value: any;

	private fulfillCb: FulfillHandler<T>[] = [];

	constructor(f?: (resolve: Handler<T>, reject: Handler<any>) => any) {
		if (f) {
			setTimeout(() => {
				try {
					f(this.fulfill.bind(this, false), this.fulfill.bind(this, true));
				} catch (e) {
					this.fulfill(true, e);
				}
			}, 0);
		}
	}

	then<T2 = T>(cb?: Handler<T, T2>, cbErr?: Handler<any>): MPromise<UnwrappedResult<T2>> {
		let promise = new MPromise<UnwrappedResult<T2>>();
		this.onFulfill((err, val) => {
			try {
				cb = err ? cbErr : cb;

				if (cb) {
					let res = cb(val);
					if (res instanceof MPromise) {
						res.onFulfill(promise.fulfill.bind(promise));
					} else {
						promise.fulfill(false, res as UnwrappedResult<T2>);
					}
				} else {
					promise.fulfill(err, val as unknown as UnwrappedResult<T2>);
				}
			} catch (e) {
				promise.fulfill(true, e);
			}
		});

		return promise;
	}

	catch<R = any>(cb: Handler<any, R>): MPromise<UnwrappedResult<R>> {
		return this.then(void 0, cb);
	}

	static resolve<T>(v: T) {
		return new MPromise<T>(res => res(v));
	}

	static reject(err: any) {
		return new MPromise((res, rej) => rej(err));
	}

	private onFulfill(cb: FulfillHandler<T>) {
		if (this.done) {
			cb(this.error, this.value);
		} else {
			this.fulfillCb.push(cb);
		}
	}

	private fulfill(err: boolean, val: T) {
		if (this.done) return;

		this.done = true;
		this.value = val;
		this.error = err;

		if (err && !this.fulfillCb.length) {
			display.log(`Unhandled promise rejection!`);
			display.log(val as unknown as string);
		}

		this.fulfillCb.forEach(f => f(err, val));
	}
}