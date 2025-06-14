
# Savings App Backend - Render Deployment

This is a Node.js/Express backend that mirrors the functionality of your Supabase Edge Functions, designed to be deployed on Render.

## Features

- **Authentication**: JWT-based authentication compatible with Supabase tokens
- **Database**: PostgreSQL with connection pooling
- **Security**: Helmet, CORS, rate limiting
- **Monitoring**: Morgan logging and health checks
- **Error Handling**: Comprehensive error handling middleware

## API Endpoints

### Authentication
- `GET /api/auth/user-data` - Get user profile and associated data

### Batches
- `POST /api/batches/create` - Create a new savings batch
- `POST /api/batches/join` - Join an existing batch with invite code

### Savings
- `POST /api/savings/manage` - Handle deposits and withdrawals

### Utility
- `GET /health` - Health check endpoint

## Local Development

1. **Install dependencies**:
   ```bash
   cd backend-render
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Run in development mode**:
   ```bash
   npm run dev
   ```

4. **Test the API**:
   ```bash
   curl http://localhost:3000/health
   ```

## Render Deployment

### Option 1: Automatic Deployment with render.yaml

1. **Connect your GitHub repository to Render**
2. **The `render.yaml` file will automatically configure**:
   - Web service (Node.js app)
   - PostgreSQL database
   - Environment variables

### Option 2: Manual Setup

1. **Create a new Web Service on Render**:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node

2. **Create a PostgreSQL database on Render**

3. **Set environment variables**:
   ```
   NODE_ENV=production
   DATABASE_URL=[automatically set by Render if using their DB]
   JWT_SECRET=[generate a secure secret]
   SUPABASE_URL=[your current Supabase URL]
   SUPABASE_SERVICE_ROLE_KEY=[your service role key]
   ```

## Database Setup

This backend can work with:

1. **Your existing Supabase database** (recommended for migration):
   - Set `DATABASE_URL` to your Supabase database connection string
   - No schema changes needed

2. **New Render PostgreSQL database**:
   - Run your existing Supabase migrations
   - Import your data

## Frontend Integration

To switch your frontend to use this backend instead of Supabase Edge Functions:

1. **Update API base URL**:
   ```typescript
   // In your frontend
   const API_BASE_URL = process.env.NODE_ENV === 'production' 
     ? 'https://your-render-app.onrender.com/api'
     : 'http://localhost:3000/api';
   ```

2. **Update function calls**:
   ```typescript
   // Instead of supabase.functions.invoke('get-user-data')
   const response = await fetch(`${API_BASE_URL}/auth/user-data`, {
     headers: {
       'Authorization': `Bearer ${session.access_token}`,
       'Content-Type': 'application/json'
     }
   });
   ```

## Migration Strategy

1. **Phase 1**: Deploy backend to Render, test with existing Supabase DB
2. **Phase 2**: Add environment variable to switch between backends
3. **Phase 3**: Gradually migrate API calls from frontend
4. **Phase 4**: Optional - migrate database to Render PostgreSQL

## Security Notes

- JWT token verification is simplified for this example
- In production, implement proper Supabase JWT verification
- Use environment variables for all sensitive data
- Enable CORS only for your frontend domain in production

## Monitoring

- Health check endpoint: `/health`
- Logs are available in Render dashboard
- Error tracking and performance monitoring can be added

## Cost Estimation

Render pricing (as of 2024):
- **Starter Plan**: $7/month for web service
- **Starter PostgreSQL**: $7/month for database
- **Total**: ~$14/month vs Supabase Edge Functions pricing

## Support

For issues or questions about this backend setup, refer to:
- [Render Documentation](https://render.com/docs)
- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
