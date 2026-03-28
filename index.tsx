import { registerRootComponent } from 'expo';
import './src/i18n';
import { initDB } from './src/storage/db';
import App from './App';

// Initialize SQLite database on startup
initDB().catch(console.error);

// Register the root component
registerRootComponent(App);
