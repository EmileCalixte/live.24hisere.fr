import React from 'react';
import { createRoot } from "react-dom/client";
import './css/bootstrap-grid.min.css';
import './css/index.css';
import './css/forms.css';
import './lib/fontawesome/css/all.min.css'
import App from './components/App';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App />);
