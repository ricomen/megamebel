// Подключение функционала "Чертоги Фрилансера"
// Подключение списка активных модуле
import { mhzModules } from "../modules.js";
// Вспомогательные функции
import { isMobile, _slideUp, _slideDown, _slideToggle, FLS } from "../functions.js";
// Модуль прокрутки к блоку
import { gotoBlock } from "../scroll/gotoblock.js";
//================================================================================================================================================================================================================================================================================================================================

/*
Документация: https://start-template.ru/rabota-s-formami-i-elementami-form-chertogi-frilansera-v3-0-0/
*/

// Работа с полями формы. Добавление классов, работа с placeholder
export function formFieldsInit(options = { viewPass: false }) {
	// Если включено, добавляем функционал "скрыть плейсходлер при фокусе"
	const formFields = document.querySelectorAll('input[placeholder],textarea[placeholder]');
	if (formFields.length) {
		formFields.forEach(formField => {
			if (!formField.hasAttribute('data-placeholder-nohide')) {
				formField.dataset.placeholder = formField.placeholder;
			}
		});
	}
	document.body.addEventListener("focusin", function (e) {
		const targetElement = e.target;
		if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
			if (targetElement.dataset.placeholder) {
				targetElement.placeholder = '';
			}
			if (!targetElement.hasAttribute('data-no-focus-classes')) {
				targetElement.classList.add('_form-focus');
				targetElement.parentElement.classList.add('_form-focus');
				targetElement.classList.add('_form-input');
				targetElement.parentElement.classList.add('_form-input');
			}
			formValidate.removeError(targetElement);
		}
	});
	document.body.addEventListener("focusout", function (e) {
		const targetElement = e.target;
		if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
			if (targetElement.dataset.placeholder) {
				targetElement.placeholder = targetElement.dataset.placeholder;
			}
			if (!targetElement.hasAttribute('data-no-focus-classes')) {
				targetElement.classList.remove('_form-focus');
				targetElement.parentElement.classList.remove('_form-focus');
				if (!targetElement.value.trim()) {
					targetElement.classList.remove('_form-input');
					targetElement.parentElement.classList.remove('_form-input');
				}
			}
			// Моментальная валидация
			if (targetElement.hasAttribute('data-validate')) {
				formValidate.validateInput(targetElement);
			}
		}
	});

	// Если включено, добавляем функционал "Показать пароль"
	if (options.viewPass) {
		document.addEventListener("click", function (e) {
			let targetElement = e.target;
			const viewPassEl = targetElement.closest('[class*="__viewpass"]');
			if (viewPassEl) {
				let inputType = viewPassEl.classList.contains('_viewpass-active') ? "password" : "text";
				viewPassEl.parentElement?.querySelector('input').setAttribute("type", inputType);
				viewPassEl.classList.toggle('_viewpass-active');
			}
		});
	}
}
// Валидация форм
export let formValidate = {
	setErrors: true,
	getErrors(form, setErrors = true) {
		let error = 0;
		this.setErrors = setErrors;
		let formRequiredItems = form.querySelectorAll('*[data-required]');
		if (formRequiredItems.length) {
			formRequiredItems.forEach(formRequiredItem => {
				if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) {
					error += this.validateInput(formRequiredItem);
				}
			});
		}
		return error;
	},
	validateInput(formRequiredItem) {
		let error = 0;
		if (formRequiredItem.pininput) {
			const value = formRequiredItem.pininput.value;
			const count = formRequiredItem.pininput.count;
			if (value.length < count) {
				this.addError(formRequiredItem);
				error++;
			} else {
				this.removeError(formRequiredItem);
			}
		} else if (formRequiredItem.dataset.required === "email") {
			if (!formRequiredItem.inputmask) {
				formRequiredItem.value = formRequiredItem.value.replace(" ", "");
			}
			if (this.emailTest(formRequiredItem)) {
				this.addError(formRequiredItem);
				error++;
			} else {
				this.removeError(formRequiredItem);
			}
		} else if (formRequiredItem.dataset.required === "phone") {
			// formRequiredItem.value = formRequiredItem.value.replace(" ", "");
			if (this.phoneTest(formRequiredItem)) {
				this.addError(formRequiredItem);
				error++;
			} else {
				this.removeError(formRequiredItem);
			}
		} else if (formRequiredItem.dataset.required === "fio") {
			if (this.fioTest(formRequiredItem)) {
				this.addError(formRequiredItem);
				error++;
			} else {
				this.removeError(formRequiredItem);
			}
		} else if (formRequiredItem.dataset.required === "password") {
			const parentForm = formRequiredItem.closest('form');
			const passwordRequireds = parentForm.querySelectorAll('[data-required="password"]');
			let errorText = this.passwordTest(passwordRequireds);
			if (passwordRequireds.length && errorText) {
				passwordRequireds.forEach(e => {
					this.addError(e, errorText);
				})
				error++;
			} else {
				passwordRequireds.forEach(e => {
					this.removeError(e, errorText);
				})
			}
		} else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
			this.addError(formRequiredItem);
			error++;
		} else if (formRequiredItem.type === "radio") {
			let name = formRequiredItem.name;
			if (!document.querySelector(`input[name="${name}"]:checked`)) {
				this.addError(formRequiredItem);
				error++;
			} else {
				this.removeError(formRequiredItem);
			}
		} else {
			if (!formRequiredItem.value.trim()) {
				if (!formRequiredItem.hidden && !formRequiredItem.closest('[hidden]')) {
					this.addError(formRequiredItem);
					error++;
				}
			} else {
				this.removeError(formRequiredItem);
			}
		}
		return error;
	},
	addError(formRequiredItem, errorTextArg) {
		if (!this.setErrors) return;
		let inputError = formRequiredItem.parentElement.querySelector('.form__error');
		if (inputError) formRequiredItem.parentElement.removeChild(inputError);
		let errorText = errorTextArg || formRequiredItem.dataset.error;
		if (errorText && errorText.trim) {
			formRequiredItem.parentElement.insertAdjacentHTML('beforeend', `<div class="form__error">${errorText}</div>`);
		}
		setTimeout(() => {
			formRequiredItem.classList.add('_form-error');
			formRequiredItem.parentElement.classList.add('_form-error');
		}, 0);
	},
	removeError(formRequiredItem) {
		formRequiredItem.classList.remove('_form-error');
		formRequiredItem.parentElement.classList.remove('_form-error');
		const parentError = formRequiredItem.parentElement.querySelector('.form__error');
		if (parentError) {
			formRequiredItem.parentElement.removeChild(parentError);
		}
		if (formRequiredItem.closest('[class*="pininput"]')) {
			formRequiredItem.parentElement.parentElement.classList.remove('_form-error');
			const parentParentError = formRequiredItem.parentElement.parentElement.querySelector('.form__error');
			if (parentParentError) {
				formRequiredItem.parentElement.parentElement.removeChild(parentParentError);
			}
		}
	},
	formClean(form) {
		if (form.tagName === 'FORM') {
			form.reset();
		}
		setTimeout(() => {
			let inputs = form.querySelectorAll('input,textarea');
			for (let index = 0; index < inputs.length; index++) {
				const el = inputs[index];
				el.parentElement.classList.remove('_form-focus');
				el.classList.remove('_form-focus');
				el.parentElement.classList.remove('_form-input');
				el.classList.remove('_form-input');
				formValidate.removeError(el);
			}
			let checkboxes = form.querySelectorAll('[type="checkbox"],[type="radio"]');
			if (checkboxes.length > 0) {
				for (let index = 0; index < checkboxes.length; index++) {
					const checkbox = checkboxes[index];
					checkbox.checked = false;
					checkbox.parentElement.classList.remove('_form-input');
					checkbox.classList.remove('_form-input');
				}
			}
			let ratings = form.querySelectorAll('.rating');
			if (ratings.length > 0) {
				for (let index = 0; index < ratings.length; index++) {
					const rating = ratings[index];
					rating.querySelector('.rating__active') ? rating.querySelector('.rating__active').style.removeProperty('width') : null;
					rating.querySelector('.rating__value') ? rating.querySelector('.rating__value').innerHTML = 0 : null;
				}
			}
			if (mhzModules.select) {
				let selects = form.querySelectorAll('.select');
				if (selects.length) {
					for (let index = 0; index < selects.length; index++) {
						const select = selects[index].querySelector('select');
						mhzModules.select.selectBuild(select);
					}
				}
			}
		}, 0);
	},
	emailTest(formRequiredItem) {
		return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
	},
	fioTest: e => !/^.+\s.+\s?.*$/i.test(e.value),
	passwordTest(passwordRequireds) {
		if (passwordRequireds.length > 1) {
			let answer = false;
			let pass = passwordRequireds[0].value;
			if (!pass.trim()) {
				return passwordRequireds[0].dataset.error || '';
			}
			for (let index = 0; index < passwordRequireds.length; index++) {
				const element = passwordRequireds[index];
				let pattern = element.dataset.pattern;
				if (pattern) {
					pattern = new RegExp(pattern);
					if (!pattern.test(element.value)) {
						answer = element.dataset.error || '';
						break;
					}
				}
				if (element.value.trim() && element.value !== pass) {
					answer = 'Пароли не совпадают';
					break;
				}
			}

			return answer;
		}
	},
	phoneTest(formRequiredItem) {
		return !/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/.test(formRequiredItem.value.replace(/\-|\s/g, ''));
	}
}
window.formValidate = formValidate;
/* Отправка форм*/
export function formSubmit() {
	const forms = document.forms;
	if (forms.length) {
		for (const form of forms) {
			form.addEventListener('submit', function (e) {
				const form = e.target;
				formSubmitAction(form, e);
			});
			form.addEventListener('reset', function (e) {
				const form = e.target;
				formValidate.formClean(form);
			});
		}
	}
	async function formSubmitAction(form, e) {
		const error = !form.hasAttribute('data-no-validate') ? formValidate.getErrors(form) : 0;
		if (error === 0) {
			const ajax = form.hasAttribute('data-ajax');
			if (ajax) { // Если режим ajax
				e.preventDefault();
				let formAction = form.getAttribute('action') ? form.getAttribute('action').trim() : '#';
				const formMethod = form.getAttribute('method') ? form.getAttribute('method').trim() : 'GET';
				const formData = new FormData(form);
				if (window.BX) {
					formData.set('sessid', BX.bitrix_sessid());
				}

				form.classList.add('_sending');
				const options = {
					method: formMethod
				}
				if (formMethod !== 'GET') {
					options.body = formData;
				} else {
					formAction = `${formAction}${getFormParams(form)}`
				}
				const response = await fetch(formAction, options);
				if (response.ok) {
					let responseResult = await response.text();
					form.classList.remove('_sending');
					formSent(form, responseResult, formData);
				} else {
					let responseResult = await response.text();
					formError(form, responseResult);
					form.classList.remove('_sending');
				}
			} else if (form.hasAttribute('data-dev')) {	// Если режим разработки
				e.preventDefault();
				form.classList.add('_sending');
				setTimeout(() => {
					const random = Math.random();
					if (random >= 0.5) {
						formSent(form);
					} else {
						formError(form);
					}
					form.classList.remove('_sending');
				}, 2000);
			}
		} else {
			e.preventDefault();
			if (form.querySelector('._form-error') && form.hasAttribute('data-goto-error')) {
				const formGoToErrorClass = form.dataset.gotoError ? form.dataset.gotoError : '._form-error';
				gotoBlock(formGoToErrorClass, true, 1000);
			}
		}
	}
	function getFormParams(form) {
		let answer = '';
		const inputs = form?.querySelectorAll('input');

		if (!inputs.length) return answer;

		inputs.forEach(input => {
			let name = input.name;
			let value = input.value;
			if (name.trim() && value.trim()) {
				answer += `${answer.includes('?' ? '&' : '?')}${name}=${value}`
			}
		})

		return answer;
	}
	
	// Действия после отправки формы
	function formSent(form, responseResult = `{"success": true}`, formData) {
		// Создаем событие отправки формы
		document.dispatchEvent(new CustomEvent("formSent", {
			detail: {
				form,
				responseResult,
				formData
			}
		}));
		// Попап показывает, если подключен модуль попапов
		// и для формы указана настройка
		setTimeout(() => {
			formSuccess(form);
		}, 0);
		// Очищаем форму
		formValidate.formClean(form);
		// Сообщаем консоли
		formLogging(`Форма отправлена!`);
	}

	async function formSuccess(form) {
		if (!mhzModules.popup) return;

		const popup = form.dataset.popupSuccess;
		if (!popup) return;

		await mhzModules.popup.open(popup);

		let timeout = Number(form.dataset.timeout);

		if (!Number.isInteger(timeout)) {
			timeout = 2000
		}

		setTimeout(() => {
			mhzModules.popup.close(popup);
		}, timeout);
	}
	async function formError(form) {
		if (!mhzModules.popup) return;

		const popup = form.dataset.popupError;
		if (!popup) return;
		await mhzModules.popup.open(popup);

		let timeout = Number(form.dataset.timeout);

		if (!Number.isInteger(timeout)) {
			timeout = 2000
		}

		setTimeout(() => {
			mhzModules.popup.close(popup);
		}, timeout);
	}

	function formLogging(message) {
		FLS(`[Форми]: ${message}`);
	}
}
/* Модуль формы "количество"*/
export function formQuantity() {
	document.addEventListener("click", function (e) {
		let targetElement = e.target;
		let disEvt = true;
		if (targetElement.closest('.quantity__button')) {
			const parent = targetElement.closest('[data-quantity]');
			if (parent) {
				const input = parent.querySelector('input');
				if (input) {
					let value = parseInt(input.value);
					let max = input.max || Infinity;
					let min = input.min || 1;
					const plusBtn = parent.querySelector('.quantity__button_plus');
					const minusBtn = parent.querySelector('.quantity__button_minus');
					if (targetElement.classList.contains('quantity__button_plus')) {
						minusBtn.disabled = false;
						if (value < max) {
							value++;
						} else {
							plusBtn.disabled = true;
						}
					} else {
						--value;
						plusBtn.disabled = false;
						disEvt = true;
						if (value < min) {
							value = min;
							minusBtn.disabled = true;
							disEvt = false;
							setMinQuantityEvt(value, parent);
						}
					}
					input.value = value;
					input.setAttribute('value', value);

					if (disEvt) {
						const event = new CustomEvent('changeQuantity', {
							bubbles: true,
							detail: {
								parent,
								value
							}
						});

						parent.dispatchEvent(event);
					}
				}
			}
		}
	});
}

function setMinQuantityEvt(value, parent) {
	const event = new CustomEvent('isMinQuantityDestination', {
		bubbles: true,
		detail: {
			parent,
			value
		}
	});

	parent.dispatchEvent(event);
}


/*
export function formRating() {
	const ratings = document.querySelectorAll('.rating');
	if (ratings.length > 0) {
		initRatings();
	}
	// Основная функция
	function initRatings() {
		let ratingActive, ratingValue;
		// "Бегаем" по всем рейтингам на странице
		for (let index = 0; index < ratings.length; index++) {
			const rating = ratings[index];
			initRating(rating);
		}
		// Инициализируем конкретный рейтинг
		function initRating(rating) {
			initRatingVars(rating);

			setRatingActiveWidth();

			if (rating.classList.contains('rating_set')) {
				setRating(rating);
			}
		}
		// Инициализация переменных
		function initRatingVars(rating) {
			ratingActive = rating.querySelector('.rating__active');
			ratingValue = rating.querySelector('.rating__value');
		}
		// Изменяем ширину активных звезд
		function setRatingActiveWidth(index = ratingValue.innerHTML) {
			const ratingActiveWidth = index / 0.05;
			ratingActive.style.width = `${ratingActiveWidth}%`;
		}
		// Возможность указать оценку
		function setRating(rating) {
			const ratingItems = rating.querySelectorAll('.rating__item');
			for (let index = 0; index < ratingItems.length; index++) {
				const ratingItem = ratingItems[index];
				ratingItem.addEventListener("mouseenter", function (e) {
					// Обновление переменных
					initRatingVars(rating);
					// Обновление активных звезд
					setRatingActiveWidth(ratingItem.value);
				});
				ratingItem.addEventListener("mouseleave", function (e) {
					// Обновление активных звезд
					setRatingActiveWidth();
				});
				ratingItem.addEventListener("click", function (e) {
					// Обновление переменных
					initRatingVars(rating);

					if (rating.dataset.ajax) {
						// "Отправить" на сервер
						setRatingValue(ratingItem.value, rating);
					} else {
						// Отобразить указанную оценку
						ratingValue.innerHTML = index + 1;
						setRatingActiveWidth();
					}
				});
			}
		}
		async function setRatingValue(value, rating) {
			if (!rating.classList.contains('rating_sending')) {
				rating.classList.add('rating_sending');

				// Отправка данных (value) на сервер
				let response = await fetch('rating.json', {
					method: 'GET',

					//body: JSON.stringify({
					//	userRating: value
					//}),
					//headers: {
					//	'content-type': 'application/json'
					//}

				});
				if (response.ok) {
					const result = await response.json();

					// Получаем новый рейтинг
					const newRating = result.newRating;

					// Вывод нового среднего результата
					ratingValue.innerHTML = newRating;

					// Обновление активных звезд
					setRatingActiveWidth();

					rating.classList.remove('rating_sending');
				} else {
					alert("Ошибка");

					rating.classList.remove('rating_sending');
				}
			}
		}
	}
}*/

/* Модуль звездного рейтинга */
export function formRating() {
	// Rating
	const ratings = document.querySelectorAll('[data-rating]');
	if (ratings) {
		ratings.forEach(rating => {
			const ratingValue = +rating.dataset.ratingValue
			const ratingSize = +rating.dataset.ratingSize ? +rating.dataset.ratingSize : 5
			formRatingInit(rating, ratingSize)
			ratingValue ? formRatingSet(rating, ratingValue) : null
			document.addEventListener('click', formRatingAction)
		});
	}
	function formRatingAction(e) {
		const targetElement = e.target;
		if (targetElement.closest('.rating__input')) {
			const currentElement = targetElement.closest('.rating__input');
			const ratingValue = +currentElement.value
			const rating = currentElement.closest('.rating')
			const ratingSet = rating.dataset.rating === 'set'
			ratingSet ? formRatingGet(rating, ratingValue) : null;
		}
	}
	function formRatingInit(rating, ratingSize) {
		let ratingItems = ``;
		for (let index = 0; index < ratingSize; index++) {
			index === 0 ? ratingItems += `<div class="rating__items">` : null
			ratingItems += `
				<label class="rating__item">
					<input class="rating__input" type="radio" name="rating" value="${index + 1}">
				</label>`
			index === ratingSize ? ratingItems += `</div">` : null
		}
		rating.insertAdjacentHTML("beforeend", ratingItems)
	}
	function formRatingGet(rating, ratingValue) {
		// Здесь отправка оценки (ratingValue) на бекенд...
		// Получаем новую  оценку formRatingSend()
		// Либо выводим ту которую указал пользователь
		const resultRating = ratingValue;
		formRatingSet(rating, resultRating);
	}
	function formRatingSet(rating, value) {
		const ratingItems = rating.querySelectorAll('.rating__item');
		const resultFullItems = parseInt(value);
		const resultPartItem = value - resultFullItems;

		rating.hasAttribute('data-rating-title') ? rating.title = value : null

		ratingItems.forEach((ratingItem, index) => {
			ratingItem.classList.remove('rating__item--active');
			ratingItem.querySelector('span') ? ratingItems[index].querySelector('span').remove() : null;

			if (index <= (resultFullItems - 1)) {
				ratingItem.classList.add('rating__item--active');
			}
			if (index === resultFullItems && resultPartItem) {
				ratingItem.insertAdjacentHTML("beforeend", `<span style="width:${resultPartItem * 100}%"></span>`)
			}
		});
	}
	function formRatingSend() {

	}

}
