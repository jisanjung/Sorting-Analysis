const insertionPerformance = {
    type: "Insertion",
    runtime: 0,
    comparisons: 0,
    exchanges: 0,
    runtimeSet: [],
    inputSet: []
};
const quickPerformance = {
    type: "Quick",
    runtime: 0,
    comparisons: 0,
    exchanges: 0,
    runtimeSet: [],
    inputSet: []
};
const mergePerformance = {
    type: "Merge",
    runtime: 0,
    comparisons: 0,
    exchanges: 0,
    runtimeSet: [],
    inputSet: []
};

// global
const swap = (list, a, b) => {
    let temp = list[b];
    list[b] = list[a];
    list[a] = temp;
}
const generateList = (size) => {
    // create an array with random values: https://stackoverflow.com/questions/5836833/create-an-array-with-random-values
    return Array.from({length: size}, () => Math.floor(Math.random() * size));
}

// insertion sort pseudocode: https://en.wikipedia.org/wiki/Insertion_sort
const insertionSort = list => {
    const start = performance.now();
    let i = 1; // element 0 is "sorted" so no need to check
    while (i < list.length) { // go thru until end of list
        let j = i;
        while (j > 0 && list[j - 1] > list[j]) { // if item previous to current item is greater, then swap
            swap(list, j, j - 1);
            j--;
            insertionPerformance.comparisons++;
            insertionPerformance.exchanges++;
        }
        i++; // next item
    }
    const end = performance.now();
    insertionPerformance.runtime = end - start;
    return list;
}

// quick sort pseudocode: https://en.wikipedia.org/wiki/Quicksort
const quickSortHelper = (list, low, high) => {
    if (low >= high || low < 0) { // low and high crossed
        return;
    }
    let pivotIndex = partition(list, low, high); // index of the pivot
    quickSortHelper(list, low, pivotIndex - 1); // lower end
    quickSortHelper(list, pivotIndex + 1, high); // higher end
}
const partition = (list, low, high) => {
    let pivot = list[high]; // last index
    let i = low - 1; // -1
    for (let j = low; j <= high - 1; j++) { // loop thru low to high
        if (list[j] <= pivot) { // if pivot is bigger
            quickPerformance.comparisons++;
            // i gets moved one positions and swaps with j
            i++;
            swap(list, i, j); 
            quickPerformance.exchanges++;
        }
    }
    // swap pivot position with i + 1, then return index of i
    i++;
    swap(list, i, high);
    quickPerformance.exchanges++;
    return i;
}
const quickSort = list => {
    const start = performance.now();
    quickSortHelper(list, 0, list.length);
    const end = performance.now();
    quickPerformance.runtime = end - start;
    return list.filter(val => val !== undefined);
}

// merge sort psuedocode: https://en.wikipedia.org/wiki/Merge_sort
const merge = (left, right) => {
    let result = [];
    while(left.length > 0 && right.length > 0) {
        if (left[0] < right[0]) {
            mergePerformance.comparisons++;
            result.push(left.shift());
            left = left.slice(0);
            mergePerformance.exchanges++;
        } else {                      
            result.push(right.shift());
            right = right.slice(0);
            mergePerformance.exchanges++;
        }
    }
    while (left.length > 0) {
        result.push(left.shift());
        left = left.slice(0);
        mergePerformance.exchanges++;
    }
    while (right.length > 0) {
        result.push(right.shift());
        right = right.slice(0);
        mergePerformance.exchanges++;
    }

  return [...result, ...left, ...right];
}
const mergeSortHelper = list => {
    if (list.length <= 1) {
        return list;
    }
    let left = [];
    let right = [];
    list.forEach((val, i) => {
        if (i < (list.length) / 2) {
            left.push(val);
            mergePerformance.exchanges++;
        } else {
            right.push(val);
            mergePerformance.exchanges++;
        }
    });
    left = mergeSortHelper(left);
    right = mergeSortHelper(right);
    return merge(left, right);
}
const mergeSort = list => {
    const start = performance.now();
    const sorted = mergeSortHelper(list);
    const end = performance.now();
    mergePerformance.runtime = end - start;
    return sorted;
}

// test data and audit
const data = {
    performance: []
};
// for runtime
for (let i = 64; i < 10000; i++) {
    let testList = generateList(i);
    if (i % 64 === 0) {
        insertionPerformance.inputSet.push(i);
        quickPerformance.inputSet.push(i);
        mergePerformance.inputSet.push(i);

        testList = generateList(i);
        insertionSort(testList);
        insertionPerformance.runtimeSet.push(insertionPerformance.runtime);
        
        testList = generateList(i);
        quickSort(testList);
        quickPerformance.runtimeSet.push(quickPerformance.runtime);

        testList = generateList(i);
        mergeSort(testList);
        mergePerformance.runtimeSet.push(mergePerformance.runtime);
    }
}
// for comparisons and exchanges
insertionPerformance.comparisons = 0;
insertionPerformance.exchanges = 0;
quickPerformance.comparisons = 0;
quickPerformance.exchanges = 0;
mergePerformance.comparisons = 0;
mergePerformance.exchanges = 0;
let testList2 = generateList(64);
insertionSort(testList2);
testList2 = generateList(64);
quickSort(testList2);
testList2 = generateList(64);
mergeSort(testList2);

// aggregate data
data.performance.push(insertionPerformance);
data.performance.push(quickPerformance);
data.performance.push(mergePerformance);
console.log(data);
const stringData = JSON.stringify(data);

// write to file
const fs = require("fs");
fs.writeFile("audit.json", stringData, (content, err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log(content);
    // file successful
});
