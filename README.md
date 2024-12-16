# Parallel Processing Test

### Claude AI Prompts:

#### Initial Prompt:
Write a very simple parallelizable piece of code in Java or JavaScript which deals with array values over 100000 in size. tell me a step-by-step of how to  time it with different numbers of parallel processes. include a very simple and easy-to-change variable for changing the numbers of parallel processes

#### Secondary Prompt:
every time, 8 workers takes more time than 2 or 4 workers

##### Concatenated output from secondary prompt:
Ah yes, this is completely normal and is due to several important factors:

1. Overhead costs - Creating and managing worker threads isn't free:
- Each worker requires memory allocation
- There's communication overhead between threads
- Context switching between threads takes CPU time

2. CPU cores - The number of physical CPU cores on your machine matters:
- If you have 4 cores, running 8 workers won't give additional parallelism
- Instead, the OS has to switch between threads, adding overhead
- The ideal number of workers usually matches your CPU core count