// script.js
document.addEventListener('DOMContentLoaded', () => {
    const whatsappNumber = "96512345678"; // <--- تأكد من أن هذا هو رقمك الصحيح
    const buyButtons = document.querySelectorAll('.buy-button');
    buyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const packageElement = button.closest('.package');
            const title = packageElement.dataset.title;
            const price = packageElement.dataset.price;
            if (title && price) {
                const message = `مرحباً،\nأرغب في طلب الباقة التالية:\n\n*الباقة:* ${title}\n*السعر:* ${price}\n\nشكراً لك.`;
                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
            } else {
                console.error("لم يتم العثور على بيانات الباقة!");
            }
        });
    });
});