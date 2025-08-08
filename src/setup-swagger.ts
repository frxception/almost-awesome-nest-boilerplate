import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const documentBuilder = new DocumentBuilder()
    .setTitle('Almost Awesome NestJS Boilerplate API')
    .setDescription(
      `## 🚀 Quick Start Guide

To get started with this API, follow these 3 simple steps:

### Step 1: Register a New User
Use the **POST /auth/register** endpoint to create a new account:
\`\`\`json
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john@example.com",
  "password": "password123"
}
\`\`\`

### Step 2: Login to Get JWT Token
Use the **POST /auth/login** endpoint with your credentials:
\`\`\`json
{
  "email": "john@example.com",
  "password": "password123"
}
\`\`\`
Copy the \`accessToken.token\` from the response.

### Step 3: Authorize Your Requests
1. Click the **🔓 Authorize** button at the top of this page
2. Enter: \`Bearer YOUR_JWT_TOKEN\` (replace YOUR_JWT_TOKEN with the token from step 2)
3. Click **Authorize**

Now you can access all protected endpoints! 🎉`,
    )
    .addBearerAuth();

  if (process.env.API_VERSION) {
    documentBuilder.setVersion(process.env.API_VERSION);
  }

  const document = SwaggerModule.createDocument(app, documentBuilder.build());

  SwaggerModule.setup('documentation', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      defaultModelsExpandDepth: 1,
      defaultModelExpandDepth: 1,
      docExpansion: 'list',
    },
  });

  console.info(
    `Documentation: http://localhost:${process.env.PORT}/documentation`,
  );
}
