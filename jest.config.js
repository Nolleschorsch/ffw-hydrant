module.exports = {
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.{js,jsx}'],
    coveragePathIgnorePatterns: ['src/mocks'],
    coverageDirectory: 'coverage',
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
        customExportConditions: [''],
    },
    setupFiles: ['./jest.polyfills.js'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleDirectories: ['node_modules', '<rootDir>/src'],
    moduleNameMapper: {
        "\\.(css|sass)$": "identity-obj-proxy",
    },
    //timers: "fake" ,
    /* fakeTimers: {
        enableGlobally: true,
    }, */
    globals: {
        //fetchImpl: fetch,
        fetch,
        Headers,
        Request,
        Response,
        FormData,
        Blob,
    }
};