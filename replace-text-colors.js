const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace color='#fff' in backgrounds that are not error or primary
    // Wait, let's just do targeted string replacements
    
    // 1. LandingClient.tsx and others with primary bg + white text
    content = content.replace(/background:\s*'var\(--primary-color\)',\s*color:\s*'#fff'/g, "background: 'var(--primary-color)', color: 'var(--text-on-primary)'");
    
    // 2. ProfileEditForm.tsx black bg
    content = content.replace(/background:\s*'rgba\(0,0,0,0\.5\)'/g, "background: 'var(--glass-icon-bg)'");

    // 3. Error color white text (leave as #fff to contrast with red) - no action needed if we just string replace carefully

    // 4. Global replacement of color: '#fff' and color: '#ffffff'
    // Let's do a regex replacement that avoids matching if it's right next to error.
    content = content.replace(/color:\s*'(#fff|#ffffff)'/gi, (match) => {
        return "color: 'var(--text-main)'";
    });
    content = content.replace(/color:\s*"(#fff|#ffffff)"/gi, (match) => {
        return 'color: "var(--text-main)"';
    });

    // Except we want to revert the ones next to error color
    content = content.replace(/background:\s*'var\(--error-color\)',([^}]*?)color:\s*'var\(--text-main\)'/g, "background: 'var(--error-color)',$1color: '#fff'");
    content = content.replace(/color:\s*'var\(--text-main\)',([^}]*?)background:\s*'var\(--error-color\)'/g, "color: '#fff',$1background: 'var(--error-color)'");

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function traverseDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            traverseDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            replaceInFile(fullPath);
        }
    }
}

traverseDirectory(directoryPath);
console.log('Text Color Replacement finished!');
