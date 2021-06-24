const ITEM_TYPE = [
  { id: 1, name: '✅ 투두리스트' },
  { id: 2, name: '📃 글' }
];

/**
 * 요소 더미 데이터
 *
 */
let data = [
  {
    id: 1,
    type: 'todo',
    category: '네카',
    date: '2021-06-23',
    content: '하이',
    order: 1
  },
  {
    id: 2,
    type: 'todo',
    category: '네카',
    date: '2021-06-24',
    content: '하이',
    order: 1
  },
  {
    id: 3,
    type: 'todo',
    category: '네카',
    date: '2021-06-25',
    content: '하이',
    order: 1
  },
  {
    id: 4,
    type: 'text',
    category: '네카',
    date: '2021-06-23',
    content: '하이',
    order: 2
  },
  {
    id: 5,
    type: 'todo',
    category: '네카',
    date: '2021-06-23',
    content: '하이',
    order: 1
  },
  {
    id: 6,
    type: 'todo',
    category: '네카',
    date: '2021-09-24',
    content: '하이 9월 24일',
    order: 1
  },
  {
    id: 7,
    type: 'todo',
    category: '네카',
    date: '2021-07-25',
    content: '하이 7월 25일',
    order: 1
  },
  {
    id: 8,
    type: 'text',
    category: '네카',
    date: '2021-08-23',
    content: '하이 8월 23일',
    order: 2
  },
  {
    id: 8,
    type: 'text',
    category: '네카',
    date: '2021-06-27',
    content: '하이 8월 23일',
    order: 2
  }
];

const $calendarDates = document.querySelector('.calendar');

// closest 커스텀 함수
const closest = ($startElem, targetClass, endClass) => {
  let elem = $startElem;
  while (!elem.classList.contains(targetClass)) {
    if (elem.classList.contains(endClass)) {
      return null;
    }
    elem = elem.parentNode;
  }
  return elem;
};

// 카테고리
const categoryUtil = (() => {
  let nextId = 1;
  let categories = [];

  const $categoryMain = document.querySelector('#categoryMain .dropdown-menu');
  const render = () => {
    // 메인화면의 카테고리 변경
    $categoryMain.innerHTML =
      categories
        .map(
          category =>
            `
              <li
                id="cateMain${category.id}"
                class="dropdown-item dropdown-option-icon ${
                  category.selected ? '--selected' : ''
                }"
                role="option"
                data-cate-name="${category.name}"
                data-cate-id=${category.id}
              >
                <input
                  type="text"
                  value="${category.name}"
                  disabled
                  class="dropdown-item-input"
                />
                <button class="category-delete-btn" aria-label="삭제">
                  <span class="icon icon-delete-gray"></span>
                </button>
              </li>
            `
        )
        .join('') +
      `
        <li class="dropdown-item dropdown-add">
          <label for="newCategoryMain" class="a11y-hidden">새로운 카테고리명</label>
          <input
            type="text"
            id="newCategoryMain"
            class="category-add-input"
            placeholder="카테고리명 입력"
          />
          <button class="category-add-btn" aria-label="추가">
            <span class="icon icon-add-gray"></span>
          </button>
        </li>
      `;

    document.getElementById('newCategoryMain').addEventListener('keyup', e => {
      if (e.key !== 'Enter') return;

      const cateName = e.target.value.trim();
      if (!cateName) return;
      categoryUtil.add(cateName);
      cateName.value = '';
      document.getElementById('newCategoryMain').focus();
    });

    // 아이템추가창 카테고리 변경
    document.querySelector('.modal-add .dropdown-category').innerHTML =
      `
      <span id="modalAddCategoryLabel" class="modal-input-label">카테고리 <span class="a11y-hidden">선택</span></span>
      <button
        type="button"
        id="modalAddCategoryBtn"
        class="dropdown-toggle"
        name="itemCategory"
        value="${categories[0].id}"
        aria-labelledby="modalAddCategoryLabel modalAddCategoryBtn"
        aria-haspopup="listbox"
      >
        ${categories[0].name}
      </button>
      <ul
        class="dropdown-menu"
        tabindex="-1"
        role="listbox"
        aria-labelledby="modalAddCategoryLabel"
    >` +
      categories
        .map(
          category =>
            `
              <li class="dropdown-item" role="option">
                <button type="button" value="${category.id}" class="dropdown-option">
                  ${category.name}
                </button>
              </li>
            `
        )
        .join('') +
      '</ul>';

    const dropdownCategoryModalAdd = (() => {
      const $dropdown = document.querySelector(
        '#modalAddCategoryBtn + .dropdown-menu'
      );
      return {
        toggle() {
          $dropdown.classList.toggle('--show');
        },
        close() {
          $dropdown.classList.remove('--show');
        }
      };
    })();

    const $categoryBtn = document.getElementById('modalAddCategoryBtn');

    document
      .querySelector('.modal-add .dropdown-category')
      .addEventListener('click', e => {
        e.stopPropagation();

        const $modalAddCategoryBtn = closest(
          e.target,
          'dropdown-toggle',
          'dropdown-category'
        );
        const $modalAddCategoryOption = closest(
          e.target,
          'dropdown-option',
          'dropdown-category'
        );

        if ($modalAddCategoryBtn) {
          dropdownCategoryModalAdd.toggle();
          return;
        }

        if ($modalAddCategoryOption) {
          $categoryBtn.textContent = $modalAddCategoryOption.textContent.trim();
          $categoryBtn.value = $modalAddCategoryOption.value;
          dropdownCategoryModalAdd.close();
        }
      });
  };

  return {
    chkLength() {
      return categories.length;
    },
    getSelectedName() {
      return categories.filter(category => category.selected)[0].name;
    },
    getFirstCategory() {
      return categories[0];
    },
    fetch(data) {
      categories = data;
      nextId = data.length + 1;
      render();
    },
    add(cateName) {
      categories = [
        ...categories,
        {
          id: nextId,
          name: cateName,
          selected: false
        }
      ];
      nextId += 1;
      render();
    },
    remove(cateId) {
      let chgSelectedIdx = 0;
      let removeSelected = false;

      categories.forEach((category, idx, { length }) => {
        if (category.id === cateId) {
          if (category.selected) removeSelected = true;
          chgSelectedIdx = idx === length - 1 ? idx - 1 : idx + 1;
        }
      });

      categories = removeSelected
        ? categories
            .map((category, idx) => {
              if (idx === chgSelectedIdx) {
                return { ...category, selected: true };
              }
              return category;
            })
            .filter(category => category.id !== cateId)
        : categories.filter(category => category.id !== cateId);
      render();
    },
    select(cateId) {
      categories = categories.map(category => {
        if (category.id === cateId) {
          return { ...category, selected: true };
        }
        if (category.selected) {
          return { ...category, selected: false };
        }
        return category;
      });
      render();
    }
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.style.setProperty(
    '--scroll-width',
    $calendarDates.offsetWidth - $calendarDates.clientWidth + 'px'
  );

  categoryUtil.fetch([
    { id: 1, name: '✔ TODO', selected: true },
    { id: 2, name: '✍ 네카라쿠배', selected: false },
    { id: 3, name: '🙏 감사일기', selected: false }
  ]);

  // 아이템 추가/편집창 타입 드롭다운 렌더링
  document.querySelector('.modal-add .dropdown-type').innerHTML =
    `
      <span id="modalAddTypeLabel" class="modal-input-label">타입 <span class="a11y-hidden">선택</span></span>
      <button
        type="button"
        id="modalAddTypeBtn"
        class="dropdown-toggle"
        name="itemType"
        value="${ITEM_TYPE[0].id}"
        aria-labelledby="modalAddTypeLabel modalAddTypeBtn"
        aria-haspopup="listbox"
      >
        ${ITEM_TYPE[0].name}
      </button>
      <ul
        class="dropdown-menu"
        tabindex="-1"
        role="listbox"
        aria-labelledby="modalAddTypeLabel"
    >` +
    ITEM_TYPE.map(
      type =>
        `
        <li class="dropdown-item" role="option">
          <button type="button" value="${type.id}" class="dropdown-option">
            ${type.name}
          </button>
        </li>
      `
    ).join('') +
    '</ul>';

  const dropdownTypeModalAdd = (() => {
    const $dropdown = document.querySelector(
      '#modalAddTypeBtn + .dropdown-menu'
    );

    return {
      toggle() {
        $dropdown.classList.toggle('--show');
      },
      close() {
        $dropdown.classList.remove('--show');
      }
    };
  })();

  const $modalAddTypeBtn = document.getElementById('modalAddTypeBtn');

  $modalAddTypeBtn.addEventListener('click', e => {
    e.stopPropagation();
    dropdownTypeModalAdd.toggle();
  });

  document
    .querySelector('#modalAddTypeBtn + .dropdown-menu')
    .addEventListener('click', e => {
      e.stopPropagation();

      const $dropdownOption = e.target;
      if (!$dropdownOption.classList.contains('dropdown-option')) return;

      $modalAddTypeBtn.textContent = $dropdownOption.textContent.trim();
      $modalAddTypeBtn.value = $dropdownOption.value;
      dropdownTypeModalAdd.close();
    });

  document.querySelector('.modal-add').addEventListener('click', () => {
    [...document.querySelectorAll('.modal-add .dropdown-menu')].forEach(
      $dropdown => {
        $dropdown.classList.remove('--show');
      }
    );
  });

  document.querySelector('.modal-dim').addEventListener('click', () => {
    modalAdd.close();
    modalEdit.close();
    [...document.querySelectorAll('.modal-add .dropdown-menu')].forEach(
      $dropdown => {
        $dropdown.classList.remove('--show');
      }
    );
  });
});

const dropdownCategoryMain = (() => {
  const $dropdown = document.querySelector('#categoryMain .dropdown-menu');
  return {
    toggle() {
      $dropdown.classList.toggle('--show');
    },
    close() {
      $dropdown.classList.remove('--show');
    }
  };
})();

document.getElementById('mainCategoryBtn').addEventListener('click', () => {
  dropdownCategoryMain.toggle();
});

document
  .querySelector('#categoryMain .dropdown-menu')
  .addEventListener('click', e => {
    const $dropdownOption = closest(
      e.target,
      'dropdown-option-icon',
      'dropdown-menu'
    );
    const $cateAddBtn = closest(e.target, 'category-add-btn', 'dropdown-menu');
    const $cateDeleteBtn = closest(
      e.target,
      'category-delete-btn',
      'dropdown-menu'
    );

    if ($cateDeleteBtn) {
      if (categoryUtil.chkLength() < 2) {
        // eslint-disable-next-line no-alert
        alert('카테고리는 1개 이상 존재해야 합니다.');
        return;
      }
      categoryUtil.remove(+$dropdownOption.dataset.cateId);
      document.getElementById('mainCategoryBtn').textContent =
        categoryUtil.getSelectedName();
      return;
    }

    if ($cateAddBtn) {
      const cateName = $cateAddBtn.previousElementSibling.value.trim();
      if (!cateName) return;
      categoryUtil.add(cateName);
      $cateAddBtn.previousElementSibling.value = '';
      document.getElementById('newCategoryMain').focus();
      return;
    }

    if ($dropdownOption) {
      document.getElementById('mainCategoryBtn').textContent =
        $dropdownOption.dataset.cateName;
      categoryUtil.select(+$dropdownOption.dataset.cateId);
      dropdownCategoryMain.close();
    }
  });

// 모달
const modalAdd = (() => {
  let isActive = false;

  const $modal = document.querySelector('.modal-add');
  const $modalDim = document.querySelector('.modal-dim');
  const $titleYear = $modal.querySelector('.month');
  const $titleMonth = $modal.querySelector('.date');
  const $itemDate = $modal.querySelector('.modal-input-date');
  const $itemContent = $modal.querySelector('.modal-input-txt');

  return {
    toggle(itemDate) {
      isActive = !isActive;
      $modal.classList.toggle('--show', isActive);
      $modalDim.classList.toggle('--show', isActive);
      document.body.classList.toggle('modal-open', isActive);

      if (!isActive) return;
      $titleYear.textContent = itemDate.slice(5, 7);
      $titleMonth.textContent = itemDate.slice(8, 10);
      $itemDate.value = itemDate;
    },
    close() {
      isActive = false;
      $modal.classList.remove('--show');
      $modalDim.classList.remove('--show');
      document.body.classList.remove('modal-open');
    },
    reset() {
      const $itemCategoryBtn = $modal.querySelector('#modalAddCategoryBtn');
      const $itemTypeBtn = $modal.querySelector('#modalAddTypeBtn');
      $itemCategoryBtn.value = categoryUtil.getFirstCategory().id;
      $itemCategoryBtn.textContent = categoryUtil.getFirstCategory().name;
      $itemTypeBtn.value = ITEM_TYPE[0].id;
      $itemTypeBtn.textContent = ITEM_TYPE[0].name;
      $itemContent.value = '';
    }
  };
})();

const modalEdit = (() => {
  let isActive = false;
  const $modal = document.querySelector('.modal-edit');
  const $modalDim = document.querySelector('.modal-dim');
  const $titleYear = document.querySelector('.modal-edit .month');
  const $titleMonth = document.querySelector('.modal-edit .date');
  const $itemDate = document.querySelector('.modal-edit .modal-input-date');
  const $itemTextArea = document.querySelector('.modal-edit .modal-input-txt');
  const $itemId = document.querySelector('.modal-edit .id');

  return {
    toggle(itemDate, content, itemId) {
      isActive = !isActive;
      $modal.classList.toggle('--show', isActive);
      $modalDim.classList.toggle('--show', isActive);
      document.body.classList.toggle('modal-open', isActive);

      if (!isActive) return;
      $itemId.value = itemId;
      $titleYear.textContent = itemDate.slice(5, 7);
      $titleMonth.textContent = itemDate.slice(8, 10);
      $itemDate.value = itemDate;
      $itemTextArea.value = content;
    },
    close() {
      isActive = false;
      $modal.classList.remove('--show');
      $modalDim.classList.remove('--show');
      document.body.classList.remove('modal-open');
    }
  };
})();

document
  .querySelector('.modal-add .modal-close-btn')
  .addEventListener('click', () => {
    modalAdd.close();
  });

document
  .querySelector('.modal-edit .modal-close-btn')
  .addEventListener('click', () => {
    modalEdit.close();
  });

document.querySelector('.calendar-dates').addEventListener('click', e => {
  // -------------------Hover Function-----------------------
  const $selectedControlBtn = closest(
    e.target,
    'item-control-btn',
    'calendar-dates'
  );
  if ($selectedControlBtn) {
    $selectedControlBtn.nextElementSibling.classList.toggle('--show');
    return;
  }
  // --------------------------------------------------------
  const $selectedAddBtn = closest(e.target, 'item-add-btn', 'calendar-dates');
  if ($selectedAddBtn) {
    const itemDate = $selectedAddBtn.parentElement.dataset.date;
    modalAdd.toggle(itemDate);
  }

  const $selectedModifyBtn = closest(
    e.target,
    'item-edit-btn',
    'calendar-dates'
  );
  if ($selectedModifyBtn) {
    const itemDate =
      $selectedModifyBtn.parentElement.parentElement.parentElement.parentElement
        .dataset.date;
    const content =
      $selectedModifyBtn.parentElement.parentElement
        .querySelector('label')
        ?.textContent.trim() ??
      $selectedModifyBtn.parentElement.parentElement
        .querySelector('p')
        ?.textContent.trim();
    const itemId = $selectedModifyBtn.parentElement.parentElement.dataset.id;

    modalEdit.toggle(itemDate, content, itemId);
  }
  const $selectedDeleteBtn = closest(
    e.target,
    'item-delete-btn',
    'calendar-dates'
  );
  if ($selectedDeleteBtn) {
    const itemId = $selectedDeleteBtn.parentElement.parentElement.dataset.id;
    const $parentNode =
      $selectedDeleteBtn.parentElement.parentElement.parentElement;
    deleteDataArray(itemId);
    deleteDataDOM(itemId, $parentNode);
  }
});

// 아이템 추가
document.querySelector('.modal-add').addEventListener('submit', e => {
  e.preventDefault();

  const newItem = {
    date: e.currentTarget.itemDate.value,
    category: e.currentTarget.itemCategory.value,
    type: e.currentTarget.itemType.value,
    content: e.currentTarget.itemContent.value
  };

  addDataArray(newItem);
  addDataDomTree(newItem);
  modalAdd.close();
  modalAdd.reset();
});

// 아이템 수정
document.querySelector('.modal-edit').addEventListener('submit', e => {
  e.preventDefault();

  const editItem = {
    id: e.currentTarget.itemId.value,
    date: e.currentTarget.itemDate.value,
    category: e.currentTarget.itemCategory.value,
    type: e.currentTarget.itemType.value,
    content: e.currentTarget.itemContent.value
  };

  modifyDataArray(editItem);
  modifyDataDOM(editItem);
  modalEdit.close();
});
