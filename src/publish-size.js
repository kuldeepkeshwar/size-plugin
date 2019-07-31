const { repo, sha, event, branch, pull_request_number, ci } = require('ci-env');
const SIZE_STORE_ENDPOINT = process.env.SIZE_STORE_ENDPOINT || 'https://size-plugin-store.now.sh' ;

// TODO: add option to turn off publishing of sizes.

async function publishDiff(diff,filename) {
	if (process.env.NODE_ENV !=='test' &&  ci && event == 'pull_request') {
		try {
			const params = { ci,repo, branch, sha, pull_request_number, diff,filename };
			await fetch(`${SIZE_STORE_ENDPOINT}/diff`, {
				method: 'POST',
				body: JSON.stringify(params)
			});
		}
		catch (error) {
			console.error('error: while publishing diff', error);
		}
	}
}
async function publishSizes(size,filename) {
	// TODO: read allowed branch from configuration
	if (process.env.NODE_ENV !=='test' &&  ci && event == 'push' && branch==='master') {
		try {
			const params = { ci,repo, branch, sha, pull_request_number, size,filename };
			await fetch(`${SIZE_STORE_ENDPOINT}/size`, {
				method: 'POST',
				body: JSON.stringify(params)
			});
		}
		catch (error) {
			console.error('error: while publishing sizes', error);
		}
	}
}
module.exports = { publishSizes,publishDiff };
