const database = firebase.database();

// Function to render food items from Firebase
function renderFoodItems() {
    const foodMenu = document.getElementById('food-menu');
    const foodItemsRef = database.ref('foodItems2');
    foodMenu.innerHTML = '';

    // Fetch categories from Firebase
    const categories = [];
    const listenForCategories = () => {
        foodItemsRef.once('value', (snapshot) => {
            categories.length = 0; // Clear the categories array
            snapshot.forEach((categorySnapshot) => {
                const category = categorySnapshot.key;
                categories.push(category);
                // ... Rest of the rendering code
            });
        });
    };
    listenForCategories();
    foodItemsRef.on('child_changed', () => {
        // Categories have changed, refresh the categories and food items
        listenForCategories();
    });

    foodItemsRef.on('value', (snapshot) => {
        snapshot.forEach((categorySnapshot) => {
            const category = categorySnapshot.key;
            const categoryHeading = document.createElement('h2');
            categoryHeading.textContent = category;
            foodMenu.appendChild(categoryHeading);

            categorySnapshot.forEach((itemSnapshot) => {
                const foodItem = itemSnapshot.val();
                const itemId = itemSnapshot.key;
                const itemContainer = document.createElement('div');
                itemContainer.classList.add('food-item-container');

                const itemName = document.createElement('span');
                itemName.textContent = foodItem.foodName;

                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.classList.add('edit-button');
                editButton.addEventListener('click', () => {
                    displayEditSection(itemContainer, category, itemId, foodItem, categories);
                });

                itemContainer.appendChild(itemName);
                itemContainer.appendChild(editButton);
                foodMenu.appendChild(itemContainer);
            });
        });
    });
}

function displayEditSection(container, category, itemId, foodItem, categories) {
    const originalContent = container.innerHTML;
    container.innerHTML = '';

    const categoryDropdown = document.createElement('select');
    categories.forEach((cat) => {
        const categoryOption = document.createElement('option');
        categoryOption.value = cat;
        categoryOption.text = cat;
        if (cat === category) {
            categoryOption.selected = true; // Select the current category
        }
        categoryDropdown.appendChild(categoryOption);
    });

    categoryDropdown.addEventListener('change', (event) => {
        // Handle dropdown change if needed
    });

    const displayCategoryDropdown = document.createElement('select');
    const displayCategories = ['Breakfast', 'Chinese', 'Juices and Chats'];

    displayCategories.forEach((displayCat) => {
        const displayCatOption = document.createElement('option');
        displayCatOption.value = displayCat;
        displayCatOption.text = displayCat;
        if (displayCat === foodItem.displayCategory) {
            displayCatOption.selected = true; // Select the current display category
        }
        displayCategoryDropdown.appendChild(displayCatOption);
    });

    displayCategoryDropdown.addEventListener('change', (event) => {
        // Handle dropdown change if needed
    });

    const itemNameInput = document.createElement('input');
    itemNameInput.type = 'text';
    itemNameInput.placeholder = 'Dish Name';
    itemNameInput.value = foodItem.foodName;

    const itemPriceInput = document.createElement('input');
    itemPriceInput.type = 'text';
    itemPriceInput.placeholder = 'Price';
    itemPriceInput.value = foodItem.cost;

    const vegNonvegDropdown = document.createElement('select');

    const vegOption = document.createElement('option');
    vegOption.value = 'veg';
    vegOption.text = 'veg';

    const nonVegOption = document.createElement('option');
    nonVegOption.value = 'nonveg';
    nonVegOption.text = 'nonveg';

    if (foodItem.vegNonVeg === 'veg') {
        vegOption.selected = true;
    } else {
        nonVegOption.selected = true;
    }

    vegNonvegDropdown.appendChild(vegOption);
    vegNonvegDropdown.appendChild(nonVegOption);

    vegNonvegDropdown.addEventListener('change', (event) => {
        // Handle dropdown change if needed
    });

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.addEventListener('click', () => {
        const newCategory = categoryDropdown.value; // Get the updated category

        if (category !== newCategory) {
            // Category has changed, move the item to the new category
            moveItemToNewCategory(category, newCategory, itemId, foodItem);
        } else {
            // Category is the same, update the item
            const newData = {
                foodName: itemNameInput.value,
                cost: parseFloat(itemPriceInput.value),
                vegNonVeg: vegNonvegDropdown.value,
                displayCategory: displayCategoryDropdown.value,
            };

            saveFoodItemChanges(newCategory, itemId, newData)
                .then(() => {
                    container.innerHTML = originalContent;
                    location.reload();
                })
                .catch((error) => {
                    console.error('Error saving changes:', error);
                    alert('Error saving changes.');
                });
        }
    });

    container.appendChild(categoryDropdown);
    container.appendChild(displayCategoryDropdown); // Added dropdown for display category
    container.appendChild(itemNameInput);
    container.appendChild(itemPriceInput);
    container.appendChild(vegNonvegDropdown);
    container.appendChild(saveButton);
}

// Function to add a new category to Firebase
function addNewCategory(newCategory) {
    const newCategoryRef = database.ref('foodItems2').child(newCategory);
    newCategoryRef.set(true)
        .then(() => {
            // The new category has been added to Firebase
        })
        .catch((error) => {
            console.error('Error adding a new category:', error);
            alert('Error adding a new category.');
        });
}

// Function to save changes to a food item
function saveFoodItemChanges(category, itemId, newData) {
    const foodItemRef = database.ref(`foodItems2/${category}/${itemId}`);
    return foodItemRef.update(newData)
        .then(() => {
            console.log('Changes saved successfully.');
        })
        .catch((error) => {
            console.error('Error saving changes:', error);
            alert('Error saving changes.');
        });
}

// Function to move a food item to a new category
function moveItemToNewCategory(oldCategory, newCategory, itemId, foodItem) {
    const oldCategoryRef = database.ref(`foodItems2/${oldCategory}/${itemId}`);
    const newCategoryRef = database.ref(`foodItems2/${newCategory}`).push();

    oldCategoryRef.remove()
        .then(() => {
            newCategoryRef.set(foodItem)
                .then(() => {
                    location.reload();
                })
                .catch((error) => {
                    console.error('Error moving item:', error);
                    alert('Error moving item.');
                });
        })
        .catch((error) => {
            console.error('Error moving item:', error);
            alert('Error moving item.');
        });
}

// Initialize the rendering on page load
window.onload = renderFoodItems;