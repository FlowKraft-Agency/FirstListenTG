const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace white glass variants
    content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.05\)/g, 'var(--glass-icon-bg)');
    content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.1\)/g, 'var(--border-color)');
    content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.03\)/g, 'var(--glass-icon-bg)');
    
    // Replace dark mode specific background variants
    content = content.replace(/rgba\(8,\s*12,\s*9,\s*0\.9\)/g, 'var(--surface-color)');
    content = content.replace(/rgba\(8,\s*12,\s*9,\s*0\.8\)/g, 'var(--surface-color)');
    
    // Replace primary color alphas
    content = content.replace(/rgba\(13,\s*242,\s*89,\s*0\.1\)/g, 'var(--primary-alpha-10)');
    content = content.replace(/rgba\(13,\s*242,\s*89,\s*0\.2\)/g, 'var(--primary-alpha-20)');
    content = content.replace(/rgba\(13,\s*242,\s*89,\s*0\.3\)/g, 'var(--shadow-primary-glow)');
    content = content.replace(/rgba\(13,\s*242,\s*89,\s*0\.4\)/g, 'var(--shadow-primary-glow)');

    // Fix hardcoded color '#0df259'
    content = content.replace(/'#0df259'/g, "'var(--primary-color)'");

    // Fix radial gradient
    content = content.replace(/radial-gradient\(circle at 50% 50%,\s*rgba\(13,\s*242,\s*89,\s*0\.15\)\s*0%,\s*rgba\(8,\s*12,\s*9,\s*1\)\s*70%\)/g, 'var(--abstract-gradient)');

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
console.log('Replacement finished!');
