const fs = require('fs');
const path = require('path');
const dir = './';

const map = {
    'á': 'á',
    'é': 'é',
    'í': 'í',
    'ó': 'ó',
    'ú': 'ú',
    'ñ': 'ñ',
    'Á': 'Á',
    'É': 'É',
    'Ã\x8D': 'Í',
    'Ó': 'Ó',
    'Ú': 'Ú',
    'Ñ': 'Ñ'
};

function fixFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    for (const [bad, good] of Object.entries(map)) {
        if (content.includes(bad)) {
            content = content.split(bad).join(good);
            changed = true;
        }
    }
    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed', filePath);
    }
}

function traverse(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== '.agents' && file !== 'docs' && file !== '.gemini' && file !== 'css' && file !== 'stitch') {
                traverse(fullPath);
            }
        } else {
            if (fullPath.endsWith('.html') || fullPath.endsWith('.js') || fullPath.endsWith('.md')) {
                fixFile(fullPath);
            }
        }
    }
}

traverse(dir);
console.log('Done');
