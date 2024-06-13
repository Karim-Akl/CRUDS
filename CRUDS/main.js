// Get HTML elements by their IDs
let title = document.getElementById('title');
let price = document.getElementById('price');
let taxes = document.getElementById('taxes');
let ads = document.getElementById('ads');
let discount = document.getElementById('discount');
let total = document.getElementById('total');
let count = document.getElementById('count');
let sum = document.getElementById('sum');
let category = document.getElementById('category');
let search = document.getElementById('Search');
let searchCategory = document.getElementById('Search_C');
let searchTitle = document.getElementById('Search_T');
let mode = 'create';
let tempIndex;
let tubeSearch = "Title";

// Calculate total price
function getTotal() {
    if (price.value > 0) {
        let result = (+price.value + +taxes.value + +ads.value) - (+discount.value);
        total.innerHTML = result;
        total.style.backgroundColor = "green";
    } else {
        total.innerHTML = 0;
        total.style.backgroundColor = "red";
    }
}

// Initialize data from localStorage
let datapro = localStorage.getItem('product') ? JSON.parse(localStorage.getItem('product')) : [];

// Handle 'sum' button click event
sum.onclick = function() {
    // Set default count to 1 if not provided
    let productCount = count.value ? count.value : 1;

    let newProduct = {
        title: title.value.toUpperCase(),
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        count: productCount,
        category: category.value.toUpperCase(),
        total: total.innerHTML
    };

    if (title.value !== '' && price.value !== '' && category.value !== '' && newProduct.count <= 100) {
        if (mode === 'create') {
            for (let i = 0; i < newProduct.count; i++) {
                datapro.push(newProduct);
            }
        } else {
            datapro[tempIndex] = newProduct;
            sum.innerHTML = 'Create';
            mode = 'create';
        }
        clearData();
    }

    localStorage.setItem('product', JSON.stringify(datapro));
    showData();
    getTotal();
};

// Clear input fields
function clearData() {
    title.value = '';
    price.value = '';
    taxes.value = '';
    ads.value = '';
    discount.value = '';
    count.value = '';
    total.innerHTML = '';
    category.value = '';
}

// Display data in the table
function showData() {
    let table = '';
    for (let i = 0; i < datapro.length; i++) {
        table += createTableRow(datapro[i], i);
    }
    document.getElementById('tbody').innerHTML = table;

    let btnDelete = document.getElementsByClassName('btnDelete1')[0];
    btnDelete.innerHTML = datapro.length > 0 
        ? `<button onclick='deleteAll()' class='btnDelete'>DELETE ALL (${datapro.length})</button>` 
        : '';
}
showData();

// Delete a single product
function deleteData(index) {
    datapro.splice(index, 1);
    localStorage.setItem('product', JSON.stringify(datapro));
    showData();
}

// Delete all products
function deleteAll() {
    localStorage.clear();
    datapro = [];
    showData();
}

// Update a product
function updateData(index) {
    let product = datapro[index];
    title.value = product.title;
    price.value = product.price;
    taxes.value = product.taxes;
    ads.value = product.ads;
    discount.value = product.discount;
    category.value = product.category;
    count.style.display = 'none';
    tempIndex = index;
    mode = 'update';
    sum.innerHTML = 'Update';
    getTotal();
}

// Set search mode
function setSearchMode(id) {
    tubeSearch = id === 'Search_T' ? 'Title' : 'Category';
    search.placeholder = `Search by ${tubeSearch}`;
    search.focus();
}

// Search for products
function searchValue(value) {
    let table = '';
    value = value.toUpperCase(); // Convert search value to uppercase for consistency
    for (let i = 0; i < datapro.length; i++) {
        let product = datapro[i];
        if (tubeSearch === "Title" && product.title.includes(value)) {
            table += createTableRow(product, i);
        } else if (tubeSearch === "Category" && product.category.includes(value)) {
            table += createTableRow(product, i);
        }
    }
    document.getElementById('tbody').innerHTML = table;
}

// Create a table row for a product
function createTableRow(product, index) {
    return `
        <tr>
            <td>${index + 1}</td>
            <td>${product.title}</td>
            <td>${product.price}</td>
            <td id="ka">${product.taxes}</td>
            <td id="ka">${product.ads}</td>
            <td id="ka">${product.discount}</td>
            <td>${product.total}</td>
            <td>${product.category}</td>
            <td><button onclick='updateData(${index})' id="UPDATE">UPDATE</button></td>
            <td><button onclick='deleteData(${index})' id="DELETE">DELETE</button></td>
        </tr>
    `;
}

// Attach event listeners to search inputs
searchTitle.onclick = function() {
    setSearchMode('Search_T');
};

searchCategory.onclick = function() {
    setSearchMode('Search_C');
};

search.oninput = function() {
    searchValue(search.value);
};
