(function() {
  'use strict';

  var wasChecked = false;
  var hasUserInteracted = false;
  var clickedGroupIndex = null;

  /* ---- helpers ---- */

  function findRadio(el) {
    if (el.tagName === 'INPUT' && el.type === 'radio') return el;
    var label = el.closest('label');
    if (label && label.getAttribute('for')) {
      return document.getElementById(label.getAttribute('for'));
    }
    return null;
  }

  function getGroupIndex(radio) {
    var swatch = radio.closest('.swatch');
    if (swatch) return swatch.getAttribute('data-option-index');
    var name = radio.getAttribute('name');
    return name || null;
  }

  function isVariantRadio(radio) {
    if (!radio || radio.type !== 'radio') return false;
    return !!(radio.closest('.swatch') || radio.closest('.element-radio'));
  }

  function getForm(radio) {
    return radio.closest('form');
  }

  function disableForm(form) {
    if (!form) return;
    var variantIdInput = form.querySelector('input[name="id"]');
    var submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
    if (variantIdInput) variantIdInput.value = '';
    if (submitBtn) submitBtn.disabled = true;
  }

  function enableForm(form) {
    if (!form) return;
    var submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.classList.remove('product-form__submit-button--pulsing');
    }
  }

  /* ---- clear selection on page load ---- */

  function clearInitialSelection() {
    if (hasUserInteracted) return;
    document.querySelectorAll('.element-radio input[type="radio"]:checked, .swatch input[type="radio"]:checked')
      .forEach(function(r) { r.checked = false; });
    document.querySelectorAll('form[action*="/cart/add"]')
      .forEach(function(form) { disableForm(form); });
  }

  /* ---- track user intent ---- */

  document.addEventListener('mousedown', function(e) {
    var radio = findRadio(e.target);
    if (radio && isVariantRadio(radio)) {
      hasUserInteracted = true;
      clickedGroupIndex = getGroupIndex(radio);
      wasChecked = radio.checked;
    } else {
      clickedGroupIndex = null;
      wasChecked = false;
    }
  });

  /* ---- click on a variant label: toggle off if already selected ---- */

  document.addEventListener('click', function(e) {
    var label = e.target.closest('label.element-radio, .swatch label');
    if (!label) return;
    var radio = findRadio(label);
    if (!radio || !isVariantRadio(radio)) return;
    if (radio.checked && wasChecked) {
      radio.checked = false;
      hasUserInteracted = false;
      disableForm(getForm(radio));
    }
  });

  /* ---- click outside all variant labels: deselect ---- */

  document.addEventListener('click', function(e) {
    var checkedRadio = document.querySelector(
      '.element-radio input[type="radio"]:checked, .swatch input[type="radio"]:checked'
    );
    if (!checkedRadio) return;
    if (!e.target.closest('label.element-radio') && !e.target.closest('.swatch')) {
      checkedRadio.checked = false;
      hasUserInteracted = false;
      disableForm(getForm(checkedRadio));
    }
  });

  /* ---- mutation observer: block any auto-recheck when user hasn't interacted ---- */

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.attributeName !== 'checked') return;
      var target = mutation.target;
      if (target.tagName !== 'INPUT' || target.type !== 'radio') return;
      if (!isVariantRadio(target)) return;
      if (target.checked && !hasUserInteracted) {
        target.checked = false;
        disableForm(getForm(target));
      }
    });
  });

  observer.observe(document.body, {
    attributes: true,
    subtree: true,
    attributeFilter: ['checked']
  });

  /* ---- swatch availability (old template) ---- */

  function getSelectedOptions(form) {
    var result = {};
    form.querySelectorAll('.swatch').forEach(function(group) {
      var checked = group.querySelector('input[type="radio"]:checked');
      if (checked) result[group.getAttribute('data-option-index')] = checked.value;
    });
    return result;
  }

  function updateAvailability(form, product) {
    var selected = getSelectedOptions(form);
    form.querySelectorAll('.swatch .swatch-element').forEach(function(el) {
      var group = el.closest('.swatch');
      if (!group) return;
      var optionIndex = group.getAttribute('data-option-index');
      var value = el.getAttribute('data-value');
      if (!value) return;
      var available = false;
      product.variants.forEach(function(v) {
        var optKey = 'option' + (parseInt(optionIndex) + 1);
        if (v[optKey] === value && v.available) {
          var match = true;
          Object.keys(selected).forEach(function(idx) {
            if (idx !== optionIndex && selected[idx]) {
              if (v['option' + (parseInt(idx) + 1)] !== selected[idx]) match = false;
            }
          });
          if (match) available = true;
        }
      });
      el.classList.toggle('soldout', !available);
      el.classList.toggle('available', available);
      var lbl = el.querySelector('label');
      if (lbl) {
        lbl.style.opacity = available ? '1' : '0.3';
        lbl.style.cursor = available ? 'pointer' : 'not-allowed';
        lbl.style.pointerEvents = available ? 'auto' : 'none';
      }
    });

    var allValues = [];
    var allSelected = true;
    form.querySelectorAll('.swatch').forEach(function(group) {
      var checked = group.querySelector('input[type="radio"]:checked');
      if (!checked) { allSelected = false; } else { allValues.push(checked.value); }
    });

    var variantIdInput = form.querySelector('input[name="id"]');
    if (allSelected && allValues.length === product.options.length) {
      product.variants.forEach(function(v) {
        var match = true;
        product.options.forEach(function(opt, idx) {
          if (v['option' + (idx + 1)] !== allValues[idx]) match = false;
        });
        if (match && variantIdInput) variantIdInput.value = v.id;
      });
    } else {
      if (variantIdInput) variantIdInput.value = '';
    }
  }

  function initProductForms() {
    document.querySelectorAll('.product_form.init').forEach(function(form) {
      var productData = form.getAttribute('data-product');
      if (!productData) return;
      var product;
      try { product = JSON.parse(productData); } catch(e) { return; }
      if (!product.variants || product.variants.length < 2) return;
      form.querySelectorAll('.swatch input[type="radio"]').forEach(function(radio) {
        radio.addEventListener('change', function() { updateAvailability(form, product); });
      });
      form.querySelectorAll('select[name="id"], select.multi_select, select:not([name="updates[]"])').forEach(function(select) {
        select.addEventListener('change', function() { updateAvailability(form, product); });
      });
      updateAvailability(form, product);
    });
  }

  /* ---- init ---- */

  function init() {
    initProductForms();
    hasUserInteracted = false;
    clearInitialSelection();
    setTimeout(clearInitialSelection, 100);
    setTimeout(clearInitialSelection, 500);

    // Reset when quickshop modal opens (fancybox v3.x uses .fb namespace)
    if (window.$ && $.fancybox) {
      $(document).on('afterLoad.fb', function() {
        hasUserInteracted = false;
        clearInitialSelection();
        setTimeout(clearInitialSelection, 100);
        setTimeout(clearInitialSelection, 300);
        setTimeout(clearInitialSelection, 600);
        setTimeout(clearInitialSelection, 1000);

        // MutationObserver: intercept any auto-check on swatch radios after modal loads
        var container = document.querySelector('.fancybox-content') || document.querySelector('.fancybox-stage');
        if (container && !container._graveMutationObserver) {
          var mo = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
              if (mutation.attributeName === 'checked') {
                var target = mutation.target;
                if (target.tagName === 'INPUT' && target.type === 'radio' &&
                    isVariantRadio(target) && target.checked && !hasUserInteracted) {
                  target.checked = false;
                  disableForm(getForm(target));
                }
              }
            });
          });
          mo.observe(container, { subtree: true, attributes: true, attributeFilter: ['checked'] });
          container._graveMutationObserver = mo;
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('load', function() {
    setTimeout(clearInitialSelection, 500);
  });

})();
