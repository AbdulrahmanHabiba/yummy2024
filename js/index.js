
// Handle menu toggle
$('.menu-icon').on('click', () => {
    $('.menu-icon i').toggleClass('fa-align-justify fa-x');
    if ($('#side-nav-menu').css("left") == '0px') {
        closeNav();
    } else {
        $('#side-nav-menu').animate({left: 0}, 500);
        openNav();
    }
});


// Function to set the mode based on local storage
function setMode(mode) {
    if (mode === 'dark-mode') {
        $('body').addClass('dark-mode').removeClass('light-mode');
        $('.left-section').addClass('dark-mode').removeClass('light-mode');
        $('.right-section').addClass('light-mode').removeClass('dark-mode');
        $('.layer').addClass('dark-mode').removeClass('light-mode');
        $('#toggle-mode i').removeClass('fa-sun').addClass('fa-moon');
    } else {
        $('body').addClass('light-mode').removeClass('dark-mode');
        $('.left-section').addClass('light-mode').removeClass('dark-mode');
        $('.right-section').addClass('dark-mode').removeClass('light-mode');
        $('.layer').addClass('light-mode').removeClass('dark-mode');
        $('#toggle-mode i').removeClass('fa-moon').addClass('fa-sun');
    }
}

// Get the current mode from local storage
let currentMode = localStorage.getItem('mode') || 'dark-mode'; // Default to light mode if not set
setMode(currentMode);

$('#toggle-mode').on('click', () => {
    // Toggle classes for dark and light modes
    $('body').toggleClass('dark-mode light-mode');
    $('.left-section').toggleClass('dark-mode light-mode');
    $('.right-section').toggleClass('dark-mode light-mode');
    $('.layer').toggleClass('dark-mode light-mode');

    // Determine the new mode and save it in local storage
    let mode = $('body').hasClass('dark-mode') ? 'dark-mode' : 'light-mode';
    localStorage.setItem('mode', mode);

    // Update the icon
    const icon = $('#toggle-mode i');
    if ($('body').hasClass('dark-mode')) {
        icon.removeClass('fa-sun').addClass('fa-moon');
    } else {
        icon.removeClass('fa-moon').addClass('fa-sun');
    }
});

const isLoadingFn = (isLoading) =>{
    if(isLoading){
        $('.loading-screen').fadeIn(300);
    }else{
        $('.loading-screen').fadeOut(300);
    }
}


// Close navigation menu
const closeNav = () => {
    $('.menu-icon i').removeClass('fa-x').addClass('fa-align-justify');
    const leftSectionWidth = $('.left-section').outerWidth();
    $('#side-nav-menu').animate({left: -leftSectionWidth}, 500);
    $('.nav-list li').animate({top: 300}, 500);
    $('#search').addClass('d-none')
    $('#contact').addClass('d-none')

};

// Open navigation menu
const openNav = () => {
    const listLength = $('.nav-list li').length;
    for (let i = 0; i < listLength; i++) {
        $('.nav-list li').eq(i).animate({top: 0}, (i + 1) * 200);
    }
};
closeNav();

// Display meals dynamically
const displayMeals = (mealsArray, mealImg, mealTitle, mealDescription) => {
    $('#main-data .row').empty();
    mealsArray.forEach((meal) => {
        const clickHandler = mealDescription ? `getCategoryMeals('${meal[mealTitle]}')` : null;
        const info = !mealDescription ? `getMealInfo('${meal.idMeal}')` : null;
        const mealHtml = `
            <div onclick="${info}"  class="col-sm-6 col-xs-6 col-md-3 col-lg-3 py-2">
                <div onclick="${clickHandler}" class="meal position-relative">
                    <img alt="" class="meal-img rounded-2 w-100" src="${meal[mealImg]}">
                    <div class="layer w-100 h-100 p-3 rounded-2 light-mode position-absolute overflow-hidden d-flex flex-column justify-content-center align-items-center">
                        <h3 class="m-0 py-2">${meal[mealTitle]}</h3>
                        ${mealDescription && meal[mealDescription] ? `<p>${meal[mealDescription].split(" ").slice(0, 15).join(" ")}</p>` : ''}
                    </div>
                </div>
            </div>`;
        $('#main-data .row').append(mealHtml);
    });
};

// Display areas or ingredients
const displayAreasAndIngredientsNames = (array, title, description, icon, type) => {
    $('#main-data .row').empty();
    array.forEach((meal) => {
        const clickHandler = type === 'a' ? `getAreaMeals('${meal[title]}')` : `getIngredientMeals('${meal[title]}')`;
        const mealHtml = `
            <div class="col-sm-6 col-xs-6 col-md-3 col-lg-3 py-2">
                <div onclick="${clickHandler}" class="meal area w-100 h-100 p-3 rounded-2 light-mode overflow-hidden d-flex flex-column justify-content-center align-items-center">
                    <i class="fa-solid ${icon} fa-3x"></i>
                    <h4 class="m-0 py-2">${meal[title]}</h4>
                    ${description && meal[description] ? `<p>${meal[description].split(" ").slice(0, 15).join(" ")}</p>` : ''}
                </div>
            </div>`;
        $('#main-data .row').append(mealHtml);
    });
};

// Fetch meals by name
const searchByName = (mealName) => {

    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`;
    getMeals(url);
};

// Fetch meals by first letter
const searchByFirstLetter = (letter) => {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`;
    getMeals(url);
};

// Fetch meals by area
const getAreaMeals = (areaName) => {
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaName}`;
    getMeals(url);
};

// Fetch meals by ingredient
const getIngredientMeals = (ingredientName) => {
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientName}`;
    getMeals(url);
};

// Fetch meals by category
const getCategoryMeals = (categoryName) => {
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`;
    getMeals(url);
};

// General function to fetch and display meals
const getMeals = async (url) => {
    isLoadingFn(true)
    try {
        $('#main-data .row').empty();
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (data.meals) {
            displayMeals(data.meals, 'strMealThumb', 'strMeal')
            isLoadingFn(false) ;
        }
        else {
            console.error('No meals found');
        }
    } catch (error) {
        console.error('Error fetching meals:', error);
    }
};

// Fetch categories
const getCategoriesNames = async () => {
    closeNav();
    isLoadingFn(true)
    try {
        $('#main-data .row').empty();
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
        const data = await res.json();
        displayMeals(data.categories, 'strCategoryThumb', 'strCategory', 'strCategoryDescription');
        isLoadingFn(false) ;

    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};

// Fetch areas or ingredients
const getAreasAndIngredientsNames = async (type) => {
    closeNav();
    isLoadingFn(true)
    try {
        $('#main-data .row').empty();
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?${type}=list`);
        const data = await res.json();
        if (type === 'a') {
            displayAreasAndIngredientsNames(data.meals, 'strArea', null, 'fa-house-laptop', 'a');
        } else {
            displayAreasAndIngredientsNames(data.meals, 'strIngredient', 'strDescription', 'fa-drumstick-bite', 'i');
        }
        isLoadingFn(false) ;

    } catch (error) {
        console.error('Error fetching areas/ingredients:', error);
    }
};
const getMealInfo = async (id) => {
    isLoadingFn(true)
    try {
        $('#main-data .row').empty();
        const res = await fetch(` https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await res.json();
        displayMealInfo(data.meals)
        isLoadingFn(false) ;
    } catch (error) {
        console.error('Error fetching areas/ingredients:', error);
    }
}
const displayMealInfo = (array) => {
    let resultTags = ``
    let tags = array[0].strTags;
    if (array[0].strTags != null) {
        tags = tags.split(',')
        tags.map(tag => {
            resultTags += `<span class="badge bg-secondary p-2 me-2">${tag}</span>`
        })
    }

    let meal = array[0];
    let ingredients = [];
    let measures = [];
    let resultRecipes = ``;
    for (let i = 1; i <= 20; i++) {
        let ingredient = meal[`strIngredient${i}`];
        let measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== "") {
            ingredients.push(ingredient.trim());
            measures.push(measure ? measure.trim() : "");
        }
    }

    ingredients.forEach((ingredient, index) => {
        let measure = measures[index];
        resultRecipes += `
            <h3 class="badge bg-danger font-monospace p-2 px-3 m-2 ms-0">${measure} ${ingredient}</h3> `
    });

    $('#main-data .row').empty();
    const mealHtml = `
          <div class="col-md-3">
        <div class="meal-caption">
            <img  alt="${array[0].strMeal}" class="border border-0 rounded-2 w-100"src="${array[0].strMealThumb}">
            <h1>${array[0].strMeal}</h1>
        </div>
    
    </div>
    <div class="col-md-9">
        <div class="meal-info ">
            <h2>Instructions</h2>
            <p class="mb-2">${array[0].strInstructions}</p>
            <h2 class="mb-2">Area : ${array[0].strArea}</h2>
            <h2 class="mb-2">Category : ${array[0].strCategory}</h2>
            <div class="recipes mb-2">
                <h2 class="mb-2">Recipes :
                 ${resultRecipes}
                </h2>
            </div>
            <div class="tags mb-4">
                <h2 class="mb-2">Tags :</h2>
                ${resultTags}
            </div>
            <ul class="d-flex flex-wrap p-0 gap-2">
            <li class="btn btn-success p-2"><a href="${array[0].strSource}" target="_blank">Source</a></li>
            <li class="btn btn-danger p-2"><a href="${array[0].strYoutube}" target="_blank">Youtube</a></li>
        </ul>
        </div>
    </div>
            `
    $('#main-data .row').append(mealHtml)

}
const search = () => {
    closeNav();
    $('#main-data .row').empty();
    $('#search').removeClass('d-none')
    $('#nameSearch').on('keyup', () => {
        searchByName($('#nameSearch').val());
    })
    $('#letterSearch').on('keyup', () => {
        searchByFirstLetter($('#letterSearch').val())
    })
}
const contactUS = ()=>{
    closeNav();
    $('#main-data .row').empty();
    $('#contact').removeClass('d-none')
}
// Attach event listeners
$('#category-li').on('click', getCategoriesNames);
$('#area-li').on('click', () => getAreasAndIngredientsNames('a'));
$('#ingredients-li').on('click', () => getAreasAndIngredientsNames('i'));
$('#search-li').on('click', ()=>{search()})
$('#contact-li').on('click', ()=>{contactUS()})

searchByName('')


function validateInputs() {
    let isValid = true;

    // Name validation
    const name = $('#name').val().trim();
    if (name === '') {
        $('#nameError').text('Name is required.');
        isValid = false;
    } else {
        $('#nameError').text('');
    }

    // Email validation
    const email = $('#email').val().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        $('#emailError').text('Enter a valid email.');
        isValid = false;
    } else {
        $('#emailError').text('');
    }

    // Phone validation
    const phone = $('#phone').val().trim();
    if (phone === '' || phone.length < 10) {
        $('#phoneError').text('Enter a valid phone number (at least 10 digits).');
        isValid = false;
    } else {
        $('#phoneError').text('');
    }

    // Age validation
    const age = $('#age').val().trim();
    if (age === '' || age <= 0) {
        $('#ageError').text('Enter a valid age.');
        isValid = false;
    } else {
        $('#ageError').text('');
    }

    // Password validation
    const password = $('#password').val().trim();
    if (password === '' || password.length < 6) {
        $('#passwordError').text('Password must be at least 6 characters.');
        isValid = false;
    } else {
        $('#passwordError').text('');
    }

    // Re-password validation
    const rePassword = $('#rePassword').val().trim();
    if (rePassword !== password) {
        $('#rePasswordError').text('Passwords do not match.');
        isValid = false;
    } else {
        $('#rePasswordError').text('');
    }

    // Enable/Disable the submit button
    $('#submitBtn').prop('disabled', !isValid);
}

// Add event listeners for validation
$('#contact input').on('input', function () {
    validateInputs();
});

// Optional: Submit button functionality
$('#submitBtn').on('click', function () {
    alert('Form submitted successfully!');
    closeNav()
    searchByName('')
});