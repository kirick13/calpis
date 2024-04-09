
const DOMAINS = [
	'wikipedia.org',
	'yahoo.com',
	'amazon.com',
	'live.com',
	'reddit.com',
	'linkedin.com',
	'blogspot.com',
	'netflix.com',
	'naver.com',
	'microsoft.com',
	'ebay.com',
	'github.com',
	'stackoverflow.com',
	'office.com',
	'msn.com',
	'paypal.com',
	'imdb.com',
	'fandom.com',
	'imgur.com',
	'wordpress.com',
	'apple.com',
	'booking.com',
	'adobe.com',
	'pinterest.com',
	'dropbox.com',
];

const promises_fetch = DOMAINS.map((domain) => fetch(`https://${domain}`));
const results = await Promise.all(promises_fetch);
const bodies = await Promise.all(
	results.map((result) => result.arrayBuffer()),
);

const promises_write = [];
for (const [ index, domain ] of DOMAINS.entries()) {
	const result = results[index];
	console.log(`${domain}: ${result.status}`);

	if (result.headers.get('content-type').startsWith('text/html')) {
		const file = Bun.file(`test/source/${domain}.html`);

		promises_write.push(
			Bun.write(
				file,
				bodies[index],
			),
		);
	}
}

await Promise.all(promises_write);
