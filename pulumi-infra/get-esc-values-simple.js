const { execSync } = require('child_process');
const fs = require('fs');

try {
    // Get all values in JSON format
    const output = execSync(`esc env open meteor-pulumi/dev`, { encoding: 'utf8' });
    
    try {
        // Parse the JSON output
        const values = JSON.parse(output);
        
        // Write values to a file that can be imported by Pulumi
        fs.writeFileSync('esc-values.json', JSON.stringify(values, null, 2));
        console.log('ESC values written to esc-values.json');
    } catch (error) {
        console.error(`Error parsing JSON output:`, error.message);
        console.error(`Output:`, output);
    }
} catch (error) {
    console.error(`Error getting ESC values:`, error.message);
}
