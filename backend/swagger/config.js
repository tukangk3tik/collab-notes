const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Collab Notes API",
            version: "1.0.0",
            description: "A collaborative note-taking API with real-time editing support",
        },
        servers: [
            {
                url: "http://localhost:3001",
                description: "Local development server",
            },
        ],
        components: {
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string" },
                        email: { type: "string", format: "email" },
                        created_at: { type: "string", format: "date-time" },
                    },
                },
                CreateUserRequest: {
                    type: "object",
                    required: ["name", "email"],
                    properties: {
                        name: { type: "string", example: "John Doe" },
                        email: { type: "string", format: "email", example: "john@example.com" },
                    },
                },
                UpdateUserRequest: {
                    type: "object",
                    properties: {
                        name: { type: "string", example: "John Doe" },
                        email: { type: "string", format: "email", example: "john@example.com" },
                    },
                },
                Note: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        title: { type: "string" },
                        content: { type: "string" },
                        owner_id: { type: "string", format: "uuid" },
                        version: { type: "integer" },
                        created_at: { type: "string", format: "date-time" },
                        updated_at: { type: "string", format: "date-time" },
                    },
                },
                CreateNoteRequest: {
                    type: "object",
                    required: ["content", "owner_id"],
                    properties: {
                        title: { type: "string", example: "Meeting Notes" },
                        content: { type: "string", example: "Discussed project timeline..." },
                        owner_id: { type: "string", format: "uuid", example: "550e8400-e29b-41d4-a716-446655440000" },
                    },
                },
                UpdateNoteRequest: {
                    type: "object",
                    properties: {
                        title: { type: "string", example: "Updated Meeting Notes" },
                        content: { type: "string", example: "Revised project timeline..." },
                    },
                },
                Error: {
                    type: "object",
                    properties: {
                        error: { type: "string" },
                    },
                },
            },
        },
    },
    apis: ["./swagger/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
