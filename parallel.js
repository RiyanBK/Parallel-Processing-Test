const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

// If this is a worker thread, process the data and send it back
if (!isMainThread) {
    const { start, end, data } = workerData;
    const result = data.slice(start, end).map(x => x * x); // Simple squaring operation
    parentPort.postMessage(result);
}
// Main thread code
else {
    async function processArrayInParallel(data, numWorkers) {
        const chunkSize = Math.ceil(data.length / numWorkers);
        const workers = [];
        console.time('Processing Time');

        // Create and start workers
        for (let i = 0; i < numWorkers; i++) {
            const start = i * chunkSize;
            const end = Math.min(start + chunkSize, data.length);
            
            const worker = new Worker(__filename, {
                workerData: { start, end, data }
            });
            workers.push(worker);
        }

        // Wait for all workers to complete and collect results
        const results = await Promise.all(
            workers.map(worker => {
                return new Promise((resolve, reject) => {
                    worker.on('message', resolve);
                    worker.on('error', reject);
                });
            })
        );

        console.timeEnd('Processing Time');
        return results.flat();
    }

    // Example usage
    async function runTest(size, numWorkers) {
        // Generate test data
        const testData = Array.from({ length: size }, (_, i) => i);
        
        console.log(`\nTesting with array size ${size} and ${numWorkers} workers`);
        const result = await processArrayInParallel(testData, numWorkers);
        console.log(`Completed processing ${result.length} elements`);
    }

    // Run tests with different numbers of workers
    async function runAllTests() {
        const arraySize = 1000000; // Change this to test different array sizes
        const workerCounts = [1, 2, 4, 8]; // Easy to modify worker counts

        for (const workers of workerCounts) {
            await runTest(arraySize, workers);
        }
    }

    runAllTests().catch(console.error);
}