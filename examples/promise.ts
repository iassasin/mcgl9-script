import {setTimeout} from '../mcgl9/timers';
import console from '../mcgl9/console';
import Promise from '../mcgl9/promise';

function wait<T>(n: number, v: T) {
	return new Promise<T>(res => setTimeout(() => res(v), n));
}

Promise.resolve('1').then(v => {
    console.log('p1', v);
    return wait(500, '2');
}).then(v => {
	console.log('p2', v);
    return Promise.reject('e1');
}).then(v => {
    console.log('p3', 'never');
}).catch(err => {
    console.log('d4', err);
    return wait(500, 'e2r');
}).catch(err => {
    console.log('d5', 'enever');
}).then(v => {
    console.log('p6', v);
    return wait(500, '3');
}).then(v => {
	console.log('p7', v);
	throw 'th1';
}).then(v => {
	console.log('p8', 'never');
}).catch(v => {
	console.log('d9', v);
	return Promise.resolve(Promise.resolve('promise'));
}).then(v => {
	console.log('p10', v);
});