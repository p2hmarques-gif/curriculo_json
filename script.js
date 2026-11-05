'use strict';

const $ = (id) => document.getElementById(id);
const texto = (valor) => typeof valor === 'string' ? valor.trim() : typeof valor === 'number' ? String(valor) : '';
const preenchido = (valor) => texto(valor).length > 0;
const valores = (entrada) => Array.isArray(entrada) ? entrada.filter(preenchido).map(texto) : [];
const registros = (entrada) => Array.isArray(entrada) ? entrada.filter(x => x && typeof x === 'object') : [];
const criar = (tag, conteudo = '', classe = '') => {
  const el = document.createElement(tag);
  if (classe) el.className = classe;
  el.textContent = conteudo;
  return el;
};
const adicionarTexto = (pai, valor, classe = '') => {
  if (valor === 0 || valor === false || !preenchido(valor)) return null;
  const p = criar('p', texto(valor), classe);
  pai.appendChild(p);
  return p;
};
const cabecalho = (pai, valor) => {
  if (preenchido(valor)) pai.appendChild(criar('h3', texto(valor)));
};
const registro = (pai) => {
  const el = criar('article', '', 'entrada');
  pai.appendChild(el);
  return el;
};
const relacao = (pai, itens, rotulo = '') => {
  const lista = valores(itens);
  if (!lista.length) return;
  if (rotulo) adicionarTexto(pai, rotulo, 'rotulo');
  const ul = criar('ul', '', 'lista');
  lista.forEach(item => ul.appendChild(criar('li', item)));
  pai.appendChild(ul);
};
const etiquetas = (pai, itens) => {
  const lista = valores(itens);
  if (!lista.length) return;
  const el = criar('div', '', 'etiquetas');
  lista.forEach(item => el.appendChild(criar('span', item, 'etiqueta')));
  pai.appendChild(el);
};
const grupo = (pai, nome, itens) => {
  const lista = valores(itens);
  if (!lista.length) return;
  const box = criar('div', '', 'grupo-habilidade');
  cabecalho(box, nome);
  etiquetas(box, lista);
  pai.appendChild(box);
};
const sitio = (valor, local = false) => {
  const v = texto(valor);
  if (!v || (!local && !/^https?:\/\//i.test(v))) return null;
  try {
    const url = new URL(v, window.location.href);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
};
const criarLink = (pai, rotulo, href, classe = '') => {
  if (!href) return null;
  const el = criar('a', rotulo, classe);
  el.href = href;
  if (/^https?:\/\//.test(href)) {
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
  }
  pai.appendChild(el);
  return el;
};
const formatarData = (valor) => {
  const v = texto(valor);
  const resultado = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(v);
  if (!resultado) return v;
  const [, ano, mes, dia] = resultado;
  if (mes && (+mes < 1 || +mes > 12)) return v;
  if (dia && (+dia < 1 || +dia > 31)) return v;
  return dia ? `${dia}/${mes}/${ano}` : mes ? `${mes}/${ano}` : ano;
};
const intervalo = (inicio, fim, atual = false) => {
  const a = formatarData(inicio);
  const b = atual ? 'Atual' : formatarData(fim);
  return a && b ? `${a} – ${b}` : a || b;
};
const renderSecao = (id, destino, construir) => {
  const el = $(destino);
  el.replaceChildren();
  construir(el);
  const tem = el.childElementCount > 0;
  $(id).hidden = !tem;
  return tem;
};
const whatsappNumero = (original) => {
  let numero = texto(original).replace(/\D/g, '');
  if (numero.length === 10 || numero.length === 11) numero = `55${numero}`;
  return /^\d{12,15}$/.test(numero) ? numero : '';
};

let documento = null;
let fotoTemporaria = '';
const whatsappInicial = $('whatsapp-contato').cloneNode(true);

function mostrarApresentacao(cv) {
  const p = cv.personalInformation || {};
  $('nome').textContent = texto(p.fullName) || 'Seu nome';
  $('cargo').textContent = texto(p.professionalTitle) || 'Título profissional';
  document.title = `${texto(p.fullName) || 'Currículo'} | Currículo profissional`;
  const loc = p.location || {};
  $('localizacao').textContent = [loc.neighborhood, loc.city, loc.state, loc.country].filter(preenchido).join(' · ');
  $('localizacao').hidden = !$('localizacao').textContent;

  const partes = texto(p.fullName).split(/\s+/).filter(Boolean);
  $('avatar').textContent = partes.length ? (partes[0][0] + (partes.length > 1 ? partes.at(-1)[0] : '')).toUpperCase() : 'CV';
  const caminhoFoto = texto(p.profilePhoto);
  const foto = fotoTemporaria || (/^data:image\/(?:jpeg|png|webp);base64,/i.test(caminhoFoto) ? caminhoFoto : sitio(caminhoFoto, true));
  $('foto').hidden = !foto;
  $('avatar').hidden = !!foto;
  if (foto) {
    $('foto').src = foto;
    $('foto').onerror = () => { $('foto').hidden = true; $('avatar').hidden = false; };
  } else $('foto').removeAttribute('src');

  const contatos = $('contatos');
  const whatsappModelo = whatsappInicial.cloneNode(true);
  contatos.replaceChildren();
  if (preenchido(p.email)) criarLink(contatos, `✉  ${texto(p.email)}`, `mailto:${texto(p.email)}`, 'contato');
  if (preenchido(p.phone)) criarLink(contatos, `☎  ${texto(p.phone)}`, `tel:${texto(p.phone).replace(/[^\d+]/g, '')}`, 'contato');

  const numero = whatsappNumero(p.whatsapp);
  if (numero) {
    const a = criar('a', '', 'contato contato-whatsapp');
    a.id = 'whatsapp-contato';
    a.href = `https://wa.me/${numero}`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.title = 'Iniciar conversa no WhatsApp';
    a.setAttribute('aria-label', 'Abrir conversa no WhatsApp');
    const svg = whatsappModelo?.querySelector('svg');
    if (svg) a.appendChild(svg.cloneNode(true));
    a.appendChild(criar('span', 'WhatsApp'));
    contatos.appendChild(a);
  } else if (whatsappModelo) {
    whatsappModelo.classList.add('inativo');
    whatsappModelo.title = 'WhatsApp: número ainda não informado';
    whatsappModelo.setAttribute('aria-label', 'WhatsApp não cadastrado');
    const textoInterno = whatsappModelo.querySelector('span');
    if (textoInterno) {
      textoInterno.textContent = 'WhatsApp ';
      textoInterno.appendChild(criar('small', 'não cadastrado'));
    }
    contatos.appendChild(whatsappModelo);
  } else {
    const substituto = criar('span', 'WhatsApp · não cadastrado', 'contato contato-whatsapp inativo');
    substituto.id = 'whatsapp-contato';
    contatos.appendChild(substituto);
  }

  [['GitHub', p.github], ['LinkedIn', p.linkedin], ['Portfólio', p.portfolio], ['Site', p.website]]
    .forEach(([rotulo, url]) => criarLink(contatos, rotulo, sitio(url), 'contato'));
}

function mostrarCurriculo(entrada) {
  const cv = entrada.cv;
  mostrarApresentacao(cv);
  const resumo = cv.professionalSummary || {};
  renderSecao('sec-resumo', 'resumo', pai => {
    adicionarTexto(pai, resumo.description);
    adicionarTexto(pai, resumo.careerObjective && `Objetivo: ${resumo.careerObjective}`);
    adicionarTexto(pai, resumo.mainSpecialization && `Especialização: ${resumo.mainSpecialization}`);
    adicionarTexto(pai, resumo.areaOfInterest && `Área de interesse: ${resumo.areaOfInterest}`);
    relacao(pai, resumo.keyCompetencies, 'Principais competências');
    relacao(pai, resumo.careerHighlights, 'Destaques de carreira');
    if (Number(resumo.yearsOfExperience) > 0) adicionarTexto(pai, `${resumo.yearsOfExperience} ano(s) de experiência`);
  });

  renderSecao('sec-experiencias', 'experiencias', pai => {
    registros(cv.professionalExperience).forEach(x => {
      if (![x.company, x.position, x.description, ...valores(x.responsibilities), ...valores(x.achievements)].some(preenchido)) return;
      const el = registro(pai);
      cabecalho(el, x.position || x.company);
      adicionarTexto(el, [x.company, x.department, x.employmentType, x.location, x.workModel].filter(preenchido).join(' · '), 'subtitulo');
      adicionarTexto(el, intervalo(x.startDate, x.endDate, x.current), 'periodo');
      adicionarTexto(el, x.description);
      relacao(el, x.responsibilities, 'Responsabilidades');
      relacao(el, x.achievements, 'Resultados');
      relacao(el, x.metrics, 'Indicadores');
      etiquetas(el, x.technologies);
      valores(x.projectLinks).forEach((url) => criarLink(el, 'Projeto relacionado', sitio(url)));
    });
  });

  renderSecao('sec-projetos', 'projetos', pai => {
    registros(cv.projects).forEach(x => {
      if (![x.name, x.description, x.role, ...valores(x.technologies)].some(preenchido)) return;
      const el = registro(pai);
      cabecalho(el, x.name);
      adicionarTexto(el, x.role, 'subtitulo');
      adicionarTexto(el, intervalo(x.startDate, x.endDate), 'periodo');
      adicionarTexto(el, x.description);
      relacao(el, x.highlights, 'Destaques');
      etiquetas(el, x.technologies);
      const links = [['Ver projeto', x.url], ['Repositório', x.repositoryUrl], ['Demonstração', x.demoUrl]];
      links.forEach(([titulo, url]) => {
        if (sitio(url)) { const linha = criar('p'); criarLink(linha, titulo, sitio(url)); el.appendChild(linha); }
      });
    });
  });

  renderSecao('sec-formacao', 'formacao', pai => {
    registros(cv.education).forEach(x => {
      if (![x.institution, x.degree, x.fieldOfStudy].some(preenchido)) return;
      const el = registro(pai);
      cabecalho(el, x.degree || x.fieldOfStudy || x.institution);
      adicionarTexto(el, [x.institution, x.level, x.campus].filter(preenchido).join(' · '), 'subtitulo');
      adicionarTexto(el, intervalo(x.startDate, x.endDate, x.current), 'periodo');
      adicionarTexto(el, x.fieldOfStudy);
      adicionarTexto(el, x.semester && `Semestre: ${x.semester}`);
      adicionarTexto(el, x.expectedGraduation && `Previsão de conclusão: ${formatarData(x.expectedGraduation)}`);
      adicionarTexto(el, x.description);
      relacao(el, x.relevantSubjects, 'Disciplinas');
      relacao(el, x.academicActivities, 'Atividades acadêmicas');
    });
  });

  renderSecao('sec-habilidades', 'habilidades', pai => {
    const s = cv.skills || {};
    const tecnicas = registros(s.technical).filter(x => preenchido(x.name)).map(x => x.level ? `${x.name} · ${x.level}` : x.name);
    [['Técnicas', tecnicas], ['Linguagens de programação', s.programmingLanguages], ['Frameworks', s.frameworks],
      ['Bancos de dados', s.databases], ['Ferramentas', s.tools], ['Metodologias', s.methodologies],
      ['Plataformas', s.platforms], ['Sistemas operacionais', s.operatingSystems], ['Comportamentais', s.behavioral]]
      .forEach(([rotulo, itens]) => grupo(pai, rotulo, itens));
  });

  renderSecao('sec-idiomas', 'idiomas', pai => {
    registros(cv.languages).forEach(x => {
      if (!preenchido(x.name)) return;
      const el = registro(pai);
      cabecalho(el, x.name);
      adicionarTexto(el, x.proficiency, 'detalhe');
      adicionarTexto(el, x.certification, 'detalhe');
    });
  });
  renderSecao('sec-certificacoes', 'certificacoes', pai => {
    registros(cv.certifications).forEach(x => {
      if (![x.name, x.issuer].some(preenchido)) return;
      const el = registro(pai);
      cabecalho(el, x.name);
      adicionarTexto(el, x.issuer, 'subtitulo');
      adicionarTexto(el, x.issueDate && `Emissão: ${formatarData(x.issueDate)}`, 'detalhe');
      adicionarTexto(el, x.expirationDate && `Validade: ${formatarData(x.expirationDate)}`, 'detalhe');
      adicionarTexto(el, x.credentialId && `ID: ${x.credentialId}`, 'detalhe');
      etiquetas(el, x.skills);
      criarLink(el, 'Ver credencial', sitio(x.credentialUrl));
    });
  });
  renderSecao('sec-cursos', 'cursos', pai => {
    registros(cv.courses).forEach(x => {
      if (![x.name, x.institution].some(preenchido)) return;
      const el = registro(pai);
      cabecalho(el, x.name);
      adicionarTexto(el, x.institution, 'subtitulo');
      adicionarTexto(el, x.completionDate && `Conclusão: ${formatarData(x.completionDate)}`, 'detalhe');
      if (Number(x.workloadHours) > 0) adicionarTexto(el, `${x.workloadHours} horas`, 'detalhe');
      adicionarTexto(el, x.description);
      criarLink(el, 'Certificado', sitio(x.certificateUrl));
    });
  });
  renderSecao('sec-voluntariado', 'voluntariado', pai => {
    registros(cv.volunteerExperience).forEach(x => {
      if (![x.organization, x.role, x.description].some(preenchido)) return;
      const el = registro(pai);
      cabecalho(el, x.role || x.organization);
      adicionarTexto(el, x.organization, 'subtitulo');
      adicionarTexto(el, intervalo(x.startDate, x.endDate, x.current), 'periodo');
      adicionarTexto(el, x.description);
      relacao(el, x.achievements);
    });
  });
  renderSecao('sec-publicacoes', 'publicacoes', pai => {
    registros(cv.publications).forEach(x => {
      if (!preenchido(x.title)) return;
      const el = registro(pai);
      cabecalho(el, x.title);
      adicionarTexto(el, [x.publisher, formatarData(x.date)].filter(preenchido).join(' · '), 'detalhe');
      adicionarTexto(el, x.description);
      criarLink(el, 'Ler publicação', sitio(x.url));
    });
  });
  renderSecao('sec-premios', 'premios', pai => {
    registros(cv.awards).forEach(x => {
      if (!preenchido(x.title)) return;
      const el = registro(pai);
      cabecalho(el, x.title);
      adicionarTexto(el, [x.issuer, formatarData(x.date)].filter(preenchido).join(' · '), 'detalhe');
      adicionarTexto(el, x.description);
    });
  });
  renderSecao('sec-eventos', 'eventos', pai => {
    registros(cv.events).forEach(x => {
      if (!preenchido(x.name)) return;
      const el = registro(pai);
      cabecalho(el, x.name);
      adicionarTexto(el, [x.role, x.institution, formatarData(x.date)].filter(preenchido).join(' · '), 'detalhe');
      adicionarTexto(el, x.description);
    });
  });
  renderSecao('sec-adicionais', 'adicionais', pai => {
    const x = cv.additionalInformation || {};
    adicionarTexto(pai, x.availability && `Disponibilidade: ${x.availability}`);
    adicionarTexto(pai, x.workModel && `Modalidade de trabalho: ${x.workModel}`);
    adicionarTexto(pai, x.drivingLicense && `CNH: ${x.drivingLicense}`);
    if (x.travelAvailability === true) adicionarTexto(pai, 'Disponibilidade para viagens');
    if (x.relocationAvailability === true) adicionarTexto(pai, 'Disponibilidade para mudança');
    adicionarTexto(pai, x.additionalNotes);
    grupo(pai, 'Interesses profissionais', x.professionalInterests);
    grupo(pai, 'Participação comunitária', x.communityInvolvement);
  });
  renderSecao('sec-preferencias', 'preferencias', pai => {
    const x = cv.preferences || {};
    adicionarTexto(pai, valores(x.targetPositions).length && `Cargos: ${valores(x.targetPositions).join(', ')}`);
    adicionarTexto(pai, valores(x.targetIndustries).length && `Áreas: ${valores(x.targetIndustries).join(', ')}`);
    adicionarTexto(pai, valores(x.preferredLocations).length && `Localidades: ${valores(x.preferredLocations).join(', ')}`);
    adicionarTexto(pai, x.preferredWorkModel && `Modelo de trabalho: ${x.preferredWorkModel}`);
    adicionarTexto(pai, valores(x.contractTypes).length && `Contratação: ${valores(x.contractTypes).join(', ')}`);
    adicionarTexto(pai, x.jobLevel && `Nível: ${x.jobLevel}`);
    adicionarTexto(pai, x.workSchedule && `Horário: ${x.workSchedule}`);
  });
  const barraLateral = document.querySelector('.coluna-lateral');
  const temLateral = Array.from(barraLateral.querySelectorAll('.secao')).some(s => !s.hidden);
  document.querySelector('.conteudo-cv').classList.toggle('sem-lateral', !temLateral);
  const data = formatarData(cv.metadata?.lastUpdated);
  $('atualizacao').textContent = data ? `Atualizado em ${data}` : '';
}

function obterCaminho(obj, caminho) {
  return caminho.split('.').reduce((atual, chave) => atual == null ? undefined : atual[chave], obj);
}
function colocarCaminho(obj, caminho, valor) {
  const segmentos = caminho.split('.');
  let atual = obj;
  segmentos.slice(0, -1).forEach(chave => {
    if (atual[chave] == null) atual[chave] = /^\d+$/.test(chave) ? [] : {};
    atual = atual[chave];
  });
  atual[segmentos.at(-1)] = valor;
}
function editarCampos() {
  const cv = documento.cv;
  document.querySelectorAll('[data-path]').forEach(el => {
    const valor = obterCaminho(cv, el.dataset.path);
    el.value = el.dataset.list === 'true' ? valores(valor).join('\n') : texto(valor);
  });
  $('json-texto').value = JSON.stringify(documento, null, 2);
}
function atualizarCampos() {
  document.querySelectorAll('[data-path]').forEach(el => {
    const valor = el.dataset.list === 'true' ? el.value.split(/\r?\n/).map(s => s.trim()).filter(Boolean) : el.value.trim();
    colocarCaminho(documento.cv, el.dataset.path, valor);
  });
  mostrarCurriculo(documento);
  editarCampos();
}
function validarDocumento(dados) {
  if (!dados || typeof dados !== 'object' || Array.isArray(dados) ||
      !dados.cv || typeof dados.cv !== 'object' || Array.isArray(dados.cv)) {
    throw new Error('O JSON precisa conter um objeto "cv" válido.');
  }
  if (!dados.cv.personalInformation || typeof dados.cv.personalInformation !== 'object') {
    throw new Error('O currículo precisa conter "personalInformation".');
  }
  return dados;
}
function avisar(id, mensagem, erro = false) {
  const el = $(id);
  el.textContent = mensagem;
  el.dataset.erro = erro ? 'true' : 'false';
  if (id === 'status') el.hidden = !mensagem;
}
function alternarEdicao(aberto) {
  $('painel-edicao').hidden = !aberto;
  $('btn-editar').setAttribute('aria-expanded', String(aberto));
  if (aberto) {
    editarCampos();
    $('painel-edicao').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
function baixarArquivo(nome, conteudo, tipo) {
  const blob = new Blob([conteudo], { type: tipo });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
function baixarHtml() {
  const copia = document.documentElement.cloneNode(true);
  const json = JSON.stringify(documento, null, 2).replace(/<\//g, '<\\/');
  copia.querySelector('#dados-iniciais').textContent = json;
  copia.querySelector('#painel-edicao').hidden = true;
  copia.querySelector('#btn-editar').setAttribute('aria-expanded', 'false');
  const entradaFoto = copia.querySelector('#arquivo-foto');
  if (entradaFoto) entradaFoto.value = '';
  baixarArquivo('index.html', '<!DOCTYPE html>\n' + copia.outerHTML, 'text/html;charset=utf-8');
}

async function carregarDados() {
  const embutidos = JSON.parse($('dados-iniciais').textContent);
  let dados = embutidos;
  if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
    try {
      const resposta = await fetch('./dados.json', { cache: 'no-store' });
      if (resposta.ok) dados = validarDocumento(await resposta.json());
    } catch (erro) { console.info('Dados embutidos utilizados:', erro.message); }
  }
  documento = validarDocumento(dados);
  mostrarCurriculo(documento);
  editarCampos();
}

$('btn-editar').addEventListener('click', () => alternarEdicao($('painel-edicao').hidden));
$('btn-editar-inferior').addEventListener('click', () => alternarEdicao(true));
$('btn-fechar-edicao').addEventListener('click', () => alternarEdicao(false));
$('btn-imprimir').addEventListener('click', () => window.print());
$('form-edicao').addEventListener('submit', e => {
  e.preventDefault();
  atualizarCampos();
  avisar('status-edicao', 'Alterações aplicadas. Para guardar, baixe o JSON e o HTML atualizados.');
});
$('btn-baixar-json').addEventListener('click', () => {
  atualizarCampos();
  baixarArquivo('dados.json', JSON.stringify(documento, null, 2) + '\n', 'application/json;charset=utf-8');
  avisar('status-edicao', 'JSON exportado.');
});
$('btn-baixar-html').addEventListener('click', () => {
  atualizarCampos();
  baixarHtml();
  avisar('status-edicao', 'HTML exportado. Guarde-o na mesma pasta de style.css e script.js.');
});
$('btn-aplicar-json').addEventListener('click', () => {
  try {
    documento = validarDocumento(JSON.parse($('json-texto').value));
    fotoTemporaria = '';
    mostrarCurriculo(documento);
    editarCampos();
    avisar('status-json', 'JSON aplicado com sucesso.');
  } catch (erro) { avisar('status-json', erro.message, true); }
});
$('arquivo-json').addEventListener('change', async e => {
  const arquivo = e.target.files?.[0];
  if (!arquivo) return;
  try {
    documento = validarDocumento(JSON.parse(await arquivo.text()));
    fotoTemporaria = '';
    mostrarCurriculo(documento);
    editarCampos();
    avisar('status', 'JSON importado. Para salvar esta versão, exporte o HTML e o JSON atualizados.');
  } catch (erro) { avisar('status', `Falha ao importar JSON: ${erro.message}`, true); }
  e.target.value = '';
});
$('arquivo-foto').addEventListener('change', async e => {
  const arquivo = e.target.files?.[0];
  if (!arquivo) return;
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(arquivo.type)) {
    avisar('status-edicao', 'Escolha uma imagem JPG, PNG ou WebP.', true);
    return;
  }
  if (arquivo.size > 3 * 1024 * 1024) {
    avisar('status-edicao', 'Escolha uma imagem de até 3 MB.', true);
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    fotoTemporaria = String(reader.result);
    documento.cv.personalInformation.profilePhoto = fotoTemporaria;
    mostrarCurriculo(documento);
    editarCampos();
    avisar('status-edicao', 'Foto adicionada. Exporte o HTML e o JSON para guardá-la.');
  };
  reader.readAsDataURL(arquivo);
});

carregarDados().catch(erro => avisar('status', `Erro ao abrir o currículo: ${erro.message}`, true));
