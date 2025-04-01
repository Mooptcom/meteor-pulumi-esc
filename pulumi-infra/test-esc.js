try {
    const esc = require('@pulumi/esc-sdk');
    console.log("ESC SDK loaded successfully");
    console.log("Available exports:", Object.keys(esc));
    
    // Try to create different objects
    if (typeof esc.Config === 'function') {
        try {
            const config = new esc.Config();
            console.log("Config created successfully");
        } catch (error) {
            console.error("Error creating Config:", error);
        }
    } else {
        console.log("esc.Config is not a constructor, it's a:", typeof esc.Config);
    }
    
    if (typeof esc.Environment === 'function') {
        try {
            const env = new esc.Environment();
            console.log("Environment created successfully");
        } catch (error) {
            console.error("Error creating Environment:", error);
        }
    } else {
        console.log("esc.Environment is not a constructor, it's a:", typeof esc.Environment);
    }
} catch (error) {
    console.error("Error loading ESC SDK:", error);
}
