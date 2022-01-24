import App from './App.svelte';

const app = new App({
	target: document.body
});

// String additions
declare global {
	interface String {
		insert(index: number, string: string): string
	}
}

String.prototype.insert = function (i, str) {
	return this.slice(0, i) + str + this.slice(i);
};

export default app;