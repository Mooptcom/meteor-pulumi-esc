try {
    const esc = require('@pulumi/esc-sdk');
    console.log("ESC SDK loaded successfully");
    
    // Explore the Configuration class
    if (typeof esc.Configuration === 'function') {
        console.log("Configuration is a constructor");
        try {
            const config = new esc.Configuration();
            console.log("Configuration instance created");
            console.log("Methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(config)));
        } catch (error) {
            console.error("Error creating Configuration:", error);
        }
    }
    
    // Explore the DefaultConfiguration
    if (esc.DefaultConfiguration) {
        console.log("DefaultConfiguration exists");
        console.log("DefaultConfiguration type:", typeof esc.DefaultConfiguration);
        if (typeof esc.DefaultConfiguration === 'object') {
            console.log("DefaultConfiguration methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(esc.DefaultConfiguration)));
        }
    }
    
    // Explore the EscApi
    if (typeof esc.EscApi === 'function') {
        console.log("EscApi is a constructor");
        try {
            const api = new esc.EscApi();
            console.log("EscApi instance created");
            console.log("Methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(api)));
        } catch (error) {
            console.error("Error creating EscApi:", error);
        }
    }
    
    // Explore the DefaultClient
    if (esc.DefaultClient) {
        console.log("DefaultClient exists");
        console.log("DefaultClient type:", typeof esc.DefaultClient);
        if (typeof esc.DefaultClient === 'object') {
            console.log("DefaultClient methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(esc.DefaultClient)));
        }
    }
} catch (error) {
    console.error("Error loading ESC SDK:", error);
}
