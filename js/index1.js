$('.menu-icon').on('click', () => {
    // const icon = $(this).('i')
    $('.menu-icon i').toggleClass('fa-align-justify fa-x')
    if ($('#side-nav-menu').css("left") == '0px') {
        closeNav()
    } else {
        $('#side-nav-menu').animate({left: 0}, 500);
        openNav()
    }
})


$('#toggle-mode').on('click', () => {
    $('body').toggleClass('dark-mode light-mode');
    $('.left-section').toggleClass('dark-mode light-mode');
    $('.right-section').toggleClass('dark-mode light-mode');
    $('.layer').toggleClass('dark-mode light-mode');
    const icon = $(this).find('i');
    if ($('body').hasClass('dark-mode')) {
        icon.removeClass('fa-sun').addClass('fa-moon'); // أيقونة القمر
    } else {
        icon.removeClass('fa-moon').addClass('fa-sun'); // أيقونة الشمس
    }
});

const closeNav = () => {
    $('.menu-icon i').removeClass('fa-x').addClass('fa-align-justify')
    const leftSectionWidth = $('.left-section').outerWidth()
    $('#side-nav-menu').animate({left: -leftSectionWidth}, 500);
    $('.nav-list li').animate({top: 300}, 500)
}
const openNav = () => {
    const listLength = $('.nav-list li').eq().prevObject.length
    for (let i = 0; i < listLength; i++) {
        $('.nav-list li').eq(i).animate({top: 0}, (i + 1) * 200)
    }
}
closeNav()
/*
// تبديل اللغة
//     $('#toggle-language').on('click', function () {
//         const currentLang = $(this).find('span').text();
//         const newLang = currentLang === 'EN' ? 'AR' : 'EN';
//         $(this).find('span').text(newLang);
//         $('html').attr('lang', newLang.toLowerCase()); // تغيير اللغة في الـ HTML
//         if (newLang === 'AR') {
//             // $('body').css('direction', 'rtl'); // يمين لليسار
//         } else {
//             // $('body').css('direction', 'ltr'); // يسار لليمين
//         }
//     });
*/

const displayMeals = (mealsArray, mealImg, mealTitle, mealDescription) => {
    let mealHtml = ''
        mealsArray.forEach((meal, ndx) => {
            const clickHandler = mealDescription ? `getCategoryMeals('${meal[mealTitle]}')` : null
            mealHtml = `
            <div class="col-sm-6 col-xs-6 col-md-3 col-lg-3 py-2">
                <div onclick = "${clickHandler} getMealInfo()" class="meal position-relative ">
                    <img alt="" class="meal-img rounded-2 w-100" src="${meal[mealImg]}">
                    <div class="layer w-100 h-100 p-3 rounded-2 light-mode position-absolute overflow-hidden d-flex flex-column justify-content-center align-items-center">
                        <h3 class="m-0 py-2">${meal[mealTitle]}</h3>
                        ${mealDescription && meal[mealDescription] ? `<p>${meal[mealDescription].split(" ").slice(0, 15).join(" ")}</p>` : ''}                        
                    </div>
                </div>
            </div>
    `
            $('.row').append(mealHtml)
        })
}

const displayAreasAndIngredientsNames = (array, title, description, icon, type) => {
    let mealHtml = ''
    array.forEach((meal, ndx) => {
        // const clickHandler = description && meal[description]
        //     ? `getIngredientMeals('${meal[title]}')`
        //     : `getAreaMeals('${meal[title]}')`;
        const clickHandler = type === 'a' ? `getAreaMeals('${meal[title]}')` : `getIngredientMeals('${meal[title]}')`;
        mealHtml = `
            <div class="col-sm-6 col-xs-6 col-md-3 col-lg-3 py-2">
                <div onclick="${clickHandler}" class="area meal w-100 h-100 p-3 rounded-2 light-mode overflow-hidden d-flex flex-column justify-content-center align-items-center ">
                        <i class="fa-solid ${icon} fa-3x"></i>
                        <h4 class="m-0 py-2">${meal[title]}</h4>
                        ${description && meal[description] ? `<p class="bg-dange">${meal[description].split(" ").slice(0, 15).join(" ")}</p>` : ''}  
                </div>
            </div>
    `
        $('.row').append(mealHtml)
    })
}
const searchByName = (mealName) => {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`
    getMeals(url)
}
const getAreaMeals = (areaName) => {
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaName}`
    getMeals(url)
}
const getIngredientMeals = (ingredientName) => {
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientName}`
    getMeals(url)
}
const getCategoryMeals = (categoryName) => {
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`
    getMeals(url)
}
const getMeals = async (url) => {
    document.querySelector('.row').innerHTML = '';
    try {
        let res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        let data = await res.json();
        displayMeals(data.meals, 'strMealThumb', 'strMeal')
    } catch (error) {
        console.error('Error : ', error);
    }
};
const getCategoriesNames = async () => {
    closeNav()
    document.querySelector('.row').innerHTML = '';
    try {
        let res = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
        let data = await res.json();
        displayMeals(data.categories, 'strCategoryThumb', 'strCategory', 'strCategoryDescription')
    } catch (error) {
        console.error('Error:', error);
    }
}
const getAreasAndIngredientsNames = async (type) => {
    closeNav()
    document.querySelector('.row').innerHTML = '';
    try {
        let res = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?${type}=list`);
        let data = await res.json();
        if (type === 'a') {
            displayAreasAndIngredientsNames(data.meals, 'strArea', null, 'fa-house-laptop', 'a')
        } else {
            displayAreasAndIngredientsNames(data.meals, 'strIngredient', 'strDescription', 'fa-drumstick-bite', 'i')
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
const getMealInfo= ()=>{
    console.log('hellooooo')
}
// searchByName('')
$('#category-li').on('click', getCategoriesNames)
$('#area-li').on('click', () => {
    getAreasAndIngredientsNames('a')
})
$('#ingredients-li').on('click', () => {
    getAreasAndIngredientsNames('i')
})
