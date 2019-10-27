import {queueMicrotask} from './timers';

type Handler<T, R = any> = (val: T) => R;
type FulfillHandler<T, R = any> = (err: PromiseState, val: T) => R;
type UnwrappedResult<T> = T extends MPromise<infer T2> ? T2 : T;

const enum PromiseState {
	PENDING = 0,
	FULFILLED = 1,
	REJECTED = 2,
}

export default class MPromise<T = any> {
	private state: PromiseState = PromiseState.PENDING;
	private value: any;

	private fulfillCb: FulfillHandler<T>[] = [];

	constructor(f?: (resolve: Handler<T>, reject: Handler<any>) => any) {
		if (f) {
			queueMicrotask(() => {
				try {
					f(this.fulfill.bind(this, PromiseState.FULFILLED), this.fulfill.bind(this, PromiseState.REJECTED));
				} catch (e) {
					this.fulfill(PromiseState.REJECTED, e);
				}
			});
		}
	}

	then<T2 = T>(cb?: Handler<T, T2>, cbErr?: Handler<any>): MPromise<UnwrappedResult<T2>> {
		let promise = new MPromise<UnwrappedResult<T2>>();

		this.onFulfill((state, val) => {
			try {
				cb = state === PromiseState.REJECTED ? cbErr : cb;
				promise.fulfill(cb ? PromiseState.FULFILLED : state, cb ? cb(val) : val);
			} catch (e) {
				promise.fulfill(PromiseState.REJECTED, e);
			}
		});

		return promise;
	}

	catch<R = any>(cb: Handler<any, R>): MPromise<UnwrappedResult<T|R>> {
		return this.then<T|R>(void 0, cb);
	}

	private onFulfill(cb: FulfillHandler<T>) {
		if (this.state !== PromiseState.PENDING) {
			cb(this.state, this.value);
		} else {
			this.fulfillCb.push(cb);
		}
	}

	private fulfill(state: PromiseState, val: any) {
		if (this.state !== PromiseState.PENDING) return;

		if (val instanceof MPromise) {
			if (val === this) {
				return this.fulfill(PromiseState.REJECTED, new TypeError(`Circular promise fulfill`));
			}

			return val.onFulfill(this.fulfill.bind(this));
		}

		this.state = state;
		this.value = val;

		if (state === PromiseState.REJECTED && !this.fulfillCb.length) {
			display.log(`Unhandled promise rejection!`);
			display.log(val as unknown as string);
		}

		this.fulfillCb.forEach(f => f(state, val));
	}

	// static

	static resolve<T>(v: T) {
		return new MPromise<T>(res => res(v));
	}

	static reject(err: any) {
		return new MPromise<never>((res, rej) => rej(err));
	}

	static all<P>(promises: P[]): MPromise<UnwrappedResult<P>[]> {
		if (!promises.length) {
			return MPromise.resolve(promises as UnwrappedResult<P>[]);
		}

		let results = Array(promises.length);
		let counter = 0;

		return new MPromise<UnwrappedResult<P>[]>((resolve, reject) => {
			function addResult(i: number, val: any) {
				++counter;
				results[i] = val;
				if (counter >= results.length) {
					resolve(results);
				}
			}

			(promises as any[]).forEach((promise, i) => {
				if (promise.then) {
					promise.then(addResult.bind(0, i), reject);
				} else {
					addResult(i, promise);
				}
			});
		});
	}
}

(Promise as any) = MPromise;