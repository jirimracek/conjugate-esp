/* eslint-disable max-len */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CNG = require('../dist/lib/conjugator');

if (process.argv.length === 2 || process.argv.includes('-h') || process.argv.includes('--help')) {
    // eslint-disable-next-line max-len
    console.log('Usage:');
    console.log(`  ${process.argv[0]} ${process.argv[1]} verb [--region=castellano|voseo|canarias|formal] [--ortho=1999|2010] [--highlight=start,end]` );
    // eslint-disable-next-line quotes
    console.log(`  Defaults: --region=castellano, --ortho=2010, --highlight='','' (no highlight)`);
    console.log('  Example: adquirir --region=voseo --ortho=1999 --highlight=<tag>,<deleted>,</tag>');
    process.exit(1);
}

let verb = process.argv[2];
let region = 'castellano';
let ortho = '2010';
let tags = {start: '', end: '', deleted: ''};
process.argv.slice(3).forEach(arg => {
    if (!arg.startsWith('--')) {
        console.error(`Argument not recognized: ${arg}, try -h | --help`);
        process.exit(1);
    }
    if (arg.startsWith('--region=')) {
        region = arg.split('=')[1].trim();
    }
    if (arg.startsWith('--ortho=')) {
        ortho = arg.split('=')[1].trim();
    }
    if (arg.startsWith('--highlight=')) {
        [tags.start, tags.end, tags.deleted] = arg.split('=')[1].trim().split(',').map(s => s.trim());
    }
});
const cng = new CNG.Conjugator();
cng.setOrthography(ortho);  
cng.setHighlightTags(tags);
console.log(`${verb}, ${region}, ${ortho}, start:${tags.start}, end:${tags.end}, deleted:${tags.deleted}`);
const table = cng.conjugateSync(verb, region);
console.log(JSON.stringify(table, null, 1));
// console.log(JSON.stringify(cng.getDefectiveVerbListSync(), null, 1));
// console.log(JSON.stringify(cng.getDefectiveVerbListSync(true), null, 1));
// console.log(cng.getOrthoVerbListSync());