# Currículo profissional — Pedro Henrique Marques Silva

Projeto de currículo/portfólio em HTML, CSS, JavaScript e JSON, com design minimalista, responsivo e adequado à impressão em A4. Nenhuma biblioteca externa é necessária.

## Arquivos

```text
curriculo-profissional-v3/
├── index.html    # Página e cópia inicial dos dados, para abertura sem servidor
├── style.css     # Estilos, mobile e impressão
├── script.js     # Exibição, edição, importação e exportação
├── dados.json    # Base de dados principal
├── README.md     # Instruções de utilização
└── imagens/      # Pasta opcional para foto
```

## Como abrir sem instalar nada

1. Extraia todo o conteúdo do ZIP.
2. Abra a pasta e clique duas vezes em `index.html`.
3. A página funciona sem internet e sem Live Server: os dados iniciais também estão incorporados no HTML.
4. Clique em **Editar dados** para preencher os campos; em **Aplicar alterações** para visualizar.
5. Ao terminar, baixe **JSON atualizado** e **HTML atualizado** e substitua os arquivos correspondentes **na mesma pasta**. O CSS e o JavaScript devem permanecer ao lado do HTML.

## Como trabalhar com `dados.json` no VS Code

Se quiser alterar o JSON diretamente, abra a pasta no VS Code e use Live Server. Nesse modo (`http://`), o aplicativo lê `dados.json` automaticamente a cada atualização de página. Abrindo por `file://`, ele lê os dados incorporados no HTML para evitar os bloqueios de segurança do navegador. Para carregar manualmente um JSON modificado sem servidor, clique em **Importar JSON**.

## Dados já preenchidos

- Nome: Pedro Henrique Marques Silva
- Título: Estudante de Análise e Desenvolvimento de Sistemas
- E-mail: p2.hmarques@gmail.com
- Telefone: (11) 91480-8694
- Cidade/UF: Suzano, SP — Brasil
- Curso: Análise e Desenvolvimento de Sistemas, UniPiaget, iniciado em 2026 e em andamento
- GitHub: https://github.com/p2hmarques-gif

## Campos opcionais vazios

WhatsApp, LinkedIn, foto profissional, portfólio, site profissional e bairro permanecem vazios. O GitHub foi preenchido após você enviar o endereço. Nenhuma experiência profissional, certificação, habilidade ou projeto foi inventado.

Outras categorias disponíveis: perfil e objetivo, experiência, projetos, linguagens de programação, frameworks, bancos de dados, ferramentas, competências, certificações, idiomas, cursos, voluntariado, eventos, prêmios, publicações, disponibilidade e preferências de trabalho. Esses campos aparecem na página apenas quando têm conteúdo; o painel expansível **Campos adicionais disponíveis** mostra as opções.

## WhatsApp

O **ícone do WhatsApp fica sempre visível**, mesmo com número em branco, acompanhado de “não cadastrado”. Ele não abre nenhum link nessa condição. Quando preencher `personalInformation.whatsapp` com DDD (ex.: `11999999999`), o script cria automaticamente o endereço `https://wa.me/5511999999999` e o ícone passa a funcionar como botão.

## Foto

Você pode usar uma URL HTTPS, indicar um arquivo como `imagens/foto.jpg`, ou selecionar uma foto no painel de edição. Fotos selecionadas pelo painel podem ser incorporadas aos arquivos exportados. Para minimizar o tamanho, use JPG, PNG ou WebP com até 3 MB.

## Estrutura do JSON

- `cv.metadata`: versão, idioma e data.
- `cv.personalInformation`: nome, contatos, bairro, cidade, perfis e foto.
- `cv.professionalSummary`: resumo, especialização, objetivo e áreas de interesse.
- `cv.professionalExperience`: empresas, cargos, responsabilidades, resultados e tecnologias.
- `cv.education`: graduação, datas, instituição e disciplinas.
- `cv.skills`: habilidades técnicas, comportamentais, ferramentas e linguagens.
- `cv.languages`: idiomas e níveis.
- `cv.certifications`: certificados.
- `cv.projects`: projetos, links e repositórios.
- `cv.courses`: cursos complementares.
- `cv.volunteerExperience`: trabalho voluntário.
- `cv.awards`, `cv.publications`, `cv.events`: realizações complementares.
- `cv.additionalInformation`: disponibilidade e informações extras.
- `cv.preferences`: cargos, setores e modalidades pretendidos.

JSON não aceita comentários (`//`), portanto a explicação está aqui no README, e o arquivo de dados continua válido.

## Impressão e PDF

Clique em **Salvar PDF** e escolha “Salvar como PDF” na impressão do navegador. A barra de ferramentas e os campos em branco não aparecem no papel.

## Privacidade

Se publicar o projeto, seu e-mail, telefone e as informações de `dados.json` ficarão públicos. Evite incluir CPF, RG ou endereço residencial completo.
