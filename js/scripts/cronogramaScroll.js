const cronograma = document.querySelector(".sec-cronograma");
const seletores = document.querySelectorAll(".seletor-data > li > a");
const dias = document.querySelectorAll(".programacao-dia");
const primeiroId = "dia-28-junho";

window.onscroll = () => {
  let atual = primeiroId;

  const posiçãoCronograma = cronograma.offsetTop - scrollY;

  dias.forEach((seção) => {
    const posiçãoSeção = posiçãoCronograma + seção.offsetTop;

    // TODO ver se não tem um jeito de deixar isso não-hardcoded
    if (posiçãoSeção <= 124) {
      atual = seção.getAttribute("id");
    }
  });

  seletores.forEach((seletor) => {
    seletor.classList.remove("active");
    if (seletor.getAttribute("href").includes(atual)) {
      seletor.classList.add("active");
    }
  });
};
