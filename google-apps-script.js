/**
 * Google Apps Script — IAL Score Lead Capture
 * ─────────────────────────────────────────────────────────────────────────────
 * Como publicar:
 *  1. Abra script.google.com e crie um novo projeto
 *  2. Cole todo este conteúdo substituindo o código padrão
 *  3. Clique em "Implantar" → "Nova implantação"
 *  4. Tipo: "App da Web"
 *     - Executar como: Eu (sua conta Google)
 *     - Quem tem acesso: Qualquer pessoa
 *  5. Copie a URL gerada e cole em GOOGLE_SCRIPT_URL no quiz-ial.html
 *  6. Na mesma planilha que o script está vinculado, os dados serão gravados
 *     na primeira aba (ou na aba ativa)
 * ─────────────────────────────────────────────────────────────────────────────
 */

// Colunas na ordem em que serão gravadas
const HEADERS = [
  'Timestamp',
  'Nome',
  'Email',
  'Telefone',
  'Score Total',
  'Liberdade Operacional',
  'Concentração Geográfica',
  'Diversificação Patrimonial',
  'Estrutura Societária',
  'Liquidez Internacional',
  'Mobilidade Familiar',
  'Educação e Legado Familiar',
  'Crescimento Estrutural',
  'Reserva Internacional',
  'Clareza Estratégica'
];

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Cria cabeçalhos automaticamente se a planilha estiver vazia
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      // Formata a linha de cabeçalho
      const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#1a1a2e');
      headerRange.setFontColor('#C9A84C');
    }

    // Parse do body (enviado como texto simples via no-cors)
    const raw  = e.postData ? e.postData.contents : '{}';
    const data = JSON.parse(raw);

    // Monta a linha na mesma ordem dos HEADERS
    const row = [
      data.timestamp  || new Date().toISOString(),
      data.nome       || '',
      data.email      || '',
      data.telefone   || '',
      data.scoreTotal || 0,
      data['Liberdade Operacional']       || 0,
      data['Concentração Geográfica']     || 0,
      data['Diversificação Patrimonial']  || 0,
      data['Estrutura Societária']        || 0,
      data['Liquidez Internacional']      || 0,
      data['Mobilidade Familiar']         || 0,
      data['Educação e Legado Familiar']  || 0,
      data['Crescimento Estrutural']      || 0,
      data['Reserva Internacional']       || 0,
      data['Clareza Estratégica']         || 0
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, rows: sheet.getLastRow() - 1 }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Teste manual: chame testPost() no editor do Apps Script para verificar
 * se a gravação funciona antes de publicar como web app.
 */
function testPost() {
  const fakeEvent = {
    postData: {
      contents: JSON.stringify({
        timestamp  : new Date().toISOString(),
        nome       : 'Teste Silva',
        email      : 'teste@email.com',
        telefone   : '(11) 99999-9999',
        scoreTotal : 72,
        'Liberdade Operacional'      : 8,
        'Concentração Geográfica'    : 5,
        'Diversificação Patrimonial' : 7,
        'Estrutura Societária'       : 6,
        'Liquidez Internacional'     : 8,
        'Mobilidade Familiar'        : 6,
        'Educação e Legado Familiar' : 10,
        'Crescimento Estrutural'     : 8,
        'Reserva Internacional'      : 6,
        'Clareza Estratégica'        : 8
      })
    }
  };
  const result = doPost(fakeEvent);
  Logger.log(result.getContent());
}
