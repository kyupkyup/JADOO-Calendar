console.log('test');

const $calendarDates = document.querySelector('.calendar');

document.documentElement.style.setProperty(
  '--scroll-width',
  $calendarDates.offsetWidth - $calendarDates.clientWidth + 'px'
);

document.querySelector('#dropdownCategoryBtn').addEventListener('click', e => {
  document
    .querySelector('.dropdown-category .dropdown-menu')
    .classList.add('--show');
});

document.querySelector('.dropdown-calendar').addEventListener('click', e => {
  console.log('click');
  document.querySelector('.dropdown-menu').classList.add('--show');
});

document.querySelector('#dropdownCategoryBtn').addEventListener('blur', e => {
  document
    .querySelector('.dropdown-category .dropdown-menu')
    .classList.remove('--show');
});
document.querySelector('#dropdownCalendarBtn').addEventListener('blur', e => {
  document.querySelector('.dropdown-menu').classList.remove('--show');
});
