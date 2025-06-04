// src/setupTests.js
import '@testing-library/jest-dom'

// stub scrollIntoView, damit es in jsdom keine Fehler wirft
window.HTMLElement.prototype.scrollIntoView = jest.fn()
