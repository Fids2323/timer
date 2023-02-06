const URL = "https://jsonplaceholder.typicode.com/posts";
const form = document.querySelector(".reservation__form");
const footerForm = document.querySelector(".footer__form");
const formInfo = form.querySelector(".reservation__info");
const reservationName = form.querySelector("#reservation__name");
const reservationPhone = form.querySelector("#reservation__phone");
const footerInput = footerForm.querySelector(".footer__input");

reservationName.setAttribute("name", "formName");
reservationPhone.setAttribute("name", "formPhone");
footerInput.setAttribute("name", "email");

const fetchRequest = async (url, {method = "GET", callback, body, headers}) => {
	try {
		const options = {
			method,
		};
		if (body) options.body = JSON.stringify(body);
		if (headers) options.headers = headers;
		const response = await fetch(url, options);
		if (response.ok) {
			const data = await response.json();
			if (callback) callback(null, data);
			return;
		}
		throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
	} catch (err) {
		callback(err);
	}
};

form.addEventListener("submit", (e) => {
	e.preventDefault();
	fetchRequest(URL, {
		method: "POST",
		body: {
			date: form.dates.value,
			people: form.people.value,
			name: form.formName.value,
			phone: form.formPhone.value,
		},
		callback(err, data) {
			if (err) {
				console.warn(err, data);
				form.textContent = "";
				const h2 = document.createElement("h2");
				const p = document.createElement("p");
				const btn = document.createElement("button");
				h2.textContent = "Упс... Что-то пошло не так";
				p.textContent = "Не удалось отправить заявку. Пожалуйста, повторите отправку еще раз";
				btn.className = "button reservation__button";
				btn.textContent = "Забронировать";
				form.append(h2, p, btn);
				btn.addEventListener("click", () => {
					location.reload();
				});
				return;
			}
			form.textContent = "";
			const h2 = document.createElement("h2");
			const p = document.createElement("p");
			const img = document.createElement("img");
			h2.textContent = "Ваша заявка успешно отправлена";
			p.textContent = "Наши менеджеры свяжутся с вами в течении 3-х рабочих дней";
			img.src = "/img/Ok.svg";
			form.append(h2, p, img);
		},
		headers: {
			"Content-Type": "application/json",
		},
	});
});

footerForm.addEventListener("submit", (e) => {
	e.preventDefault();
	fetchRequest(URL, {
		method: "POST",
		body: {
			email: footerForm.email.value,
		},
		callback(err, data) {
			if (err) {
				console.warn(err, data);
				form.textContent = err;
			}
			formInfo.textContent = `Заявка успешно отправлена, номер заявки ${data.id}`;
		},
		headers: {
			"Content-Type": "application/json",
		},
	});
	const h2 = footerForm.querySelector(".footer__form-title");
	const p = footerForm.querySelector(".footer__text");
	const footerInputWrap = footerForm.querySelector(".footer__input-wrap");
	footerInputWrap.remove();
	h2.textContent = "Ваша заявка успешно отправлена";
	p.textContent = "Наши менеджеры свяжутся с вами в течении 3-х рабочих дней";
});
