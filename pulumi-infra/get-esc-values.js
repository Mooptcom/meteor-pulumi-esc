const { execSync } = require('child_process');
const fs = require('fs');

// Function to get ESC values using the CLI
function getEscValue(key) {
    try {
        const output = execSync(`esc env get meteor-pulumi/dev ${key}`, { encoding: 'utf8' });
        
        // Parse the output to extract the value
        // The output format is expected to be something like:
        //    Value
        //     "some-value"
        //    Definition
        //     some-value
        
        const lines = output.split('\n');
        // Find the line after "Value" and trim it
        let valueIndex = -1;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim() === 'Value') {
                valueIndex = i + 1;
                break;
            }
        }
        
        if (valueIndex >= 0 && valueIndex < lines.length) {
            // Extract the value, removing quotes if present
            let value = lines[valueIndex].trim();
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.substring(1, value.length - 1);
            }
            return value;
        }
        
        // If we can't parse the output, return null
        console.error(`Could not parse output for ${key}:`, output);
        return null;
    } catch (error) {
        console.error(`Error getting ESC value for ${key}:`, error.message);
        return null;
    }
}

// Get values
const mongodbUri = getEscValue('mongodb_uri');
const gcpProject = getEscValue('gcp_project');
const gcpRegion = getEscValue('gcp_region');

// Write values to a file that can be imported by Pulumi
const config = {
    mongodbUri,
    gcpProject,
    gcpRegion
};

fs.writeFileSync('esc-values.json', JSON.stringify(config, null, 2));
console.log('ESC values written to esc-values.json');
