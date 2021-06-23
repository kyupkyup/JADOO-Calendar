// -------------------Drag and Drop Function-----------------------
$calendarDates.addEventListener('mousedown', mousedownEvent => {
  if (mousedownEvent.target.classList.contains('icon-move')) {
    mousedownEvent.target.style['pointer-events'] = 'none';
    mousedownEvent.target.parentNode.style['pointer-events'] = 'none';
    mousedownEvent.target.parentNode.parentNode.style['pointer-events'] =
      'none';
    mousedownEvent.target.parentNode.parentNode.parentNode.classList.add(
      'dragging'
    );

    let afterElement = null;
    let draggable = null;
    let $container = null;
    let prevAfterElemnt = null;
    let prev$container = null;

    $calendarDates.onmouseover = e => {
      if (prevAfterElemnt) prevAfterElemnt.style.border = 'none';
      if (prev$container) prev$container.style.border = 'none';

      $container = e.target.closest('.items');
      if (!$container) return;
      afterElement = e.target.closest('li');
      draggable = document.querySelector('.dragging');
      if (afterElement === draggable) {
        return;
      }

      if (afterElement == null) {
        if (!$container.lastElementChild) {
          $container.style['border-top'] = 'solid 5px gray';
          prev$container = $container;
        } else {
          $container.lastElementChild.style['border-bottom'] = 'solid 5px gray';
          prev$container = $container.lastElementChild;
        }
      } else {
        afterElement.style['border-top'] = 'solid 5px gray';
        prevAfterElemnt = afterElement;
      }
    };

    const removeDraggingClass = () => {
      if (prevAfterElemnt) prevAfterElemnt.style.border = 'none';
      if (prev$container) prev$container.style.border = 'none';
      mousedownEvent.target.parentNode.parentNode.parentNode.style.border =
        'none';
      mousedownEvent.target.parentNode.parentNode.parentNode.classList.remove(
        'dragging'
      );
      document.removeEventListener('mouseup', removeDraggingClass);
      $calendarDates.onmouseover = null;
      mousedownEvent.target.style['pointer-events'] = 'auto';
      mousedownEvent.target.parentNode.style['pointer-events'] = 'auto';
      mousedownEvent.target.parentNode.parentNode.style['pointer-events'] =
        'auto';
      if (!$container) return;
      if (afterElement == null) {
        $container.appendChild(draggable);
      } else {
        $container.insertBefore(draggable, afterElement);
      }
    };

    document.addEventListener('mouseup', removeDraggingClass);
  }
});
// ----------------------------------------------------------------
