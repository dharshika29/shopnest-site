const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'frontend', 'src');
const searchString = 'http://localhost:5000';
const replaceString = 'https://shopnest-site.onrender.com';

function replaceInFiles(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInFiles(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes(searchString)) {
                content = content.split(searchString).join(replaceString);
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Replaced in ${fullPath}`);
            }
        }
    });
}

replaceInFiles(directoryPath);
console.log('Done!');
