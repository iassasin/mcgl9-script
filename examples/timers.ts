import '../mcgl9';
import {setInterval} from '../mcgl9/timers';
import console from '../mcgl9/console';

let curTime = Date.now();

function to() {
	console.log(`Executed after ${Date.now() - curTime}ms`);
	curTime = Date.now();
}

setInterval(to, 1000);
