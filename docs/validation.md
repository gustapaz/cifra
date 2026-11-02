# Validação — Cifra

## Modelo e interface

- 11 testes Node aprovados: determinismo e limites em 1.998 códigos gerados; normalização de seed; feedback com duplicatas; todas as 1.296 hipóteses de quatro posições contra um código com duplicatas comparadas com fórmula independente de multiconjuntos; validade/imutabilidade, rejeição de incompletas/repetidas, vitória na primeira/última tentativa, derrota no limite, resultado terminal inerte, replay, saves e estatísticas por faixa.
- Harness de navegador: 18 verificações aprovadas. Save corrompido, input incompleto, composição numérica, hipótese repetida sem gastar vez, pausa por blur, bloqueio pausado e retorno sem reset; vitória/derrota nos dois modos por controles DOM normais, registro único, replay preservando modo, apagar, preferências e outro sinal. Sem escrever diretamente no estado da aplicação. Blur disparado por Event, sem alegar troca física de aba. Harness/iframe fora do export.
- Export real em viewport 390 × 844: modo Ruído concluído em duas tentativas, incluindo retorno 2 exatos/1 fora e depois 5 exatos. P pausou e Escape retomou. Documento útil 375 px e scrollWidth 375 px; teclas 75 × 64 px após ajuste para quatro colunas móveis. Rolagem horizontal existe só dentro da fita. Override temporário restaurado. Evidência `mobile-victory.png`.
- Feedback com símbolos repetidos exercitado pelo código 137. Rotas derivadas do modelo e executadas por controles normais não são prova de dedução/diversão humana.
- Som e movimento reduzido persistidos no harness. Sem análise auditiva humana ou medição de FPS. Áudio limitado a quatro vozes, sem loop permanente. Corrigidos handlers para repetir sempre o código atual e para sintonizar explicitamente o campo de número, sem interpretar eventos como parâmetros.

## Segurança e gratuidade

Build e `npm audit` aprovados, sem vulnerabilidades informadas em 02/11/2026. Alpine usa build CSP, sem liberar unsafe-eval. Export apenas HTML, JS/CSS, favicon e avisos de licença; sem source maps, testes, `.git`, configuração local, imagens externas ou dados pessoais. Códigos do jogo são dados locais de entretenimento, não credenciais de segurança.

Sem conta, API remota, backend, compras, cartão, faturamento ou trial. GitHub Pages em repositório público disponível no GitHub Free: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages.

## Publicação conferida em 02/11/2026

- Implementação `42ca51b72b586d84057cf32af82e5a9cb49fb11b`; workflow `41548224529` concluiu testes, auditoria, build e deploy com sucesso.
- URL pública: Sinal vencido em quatro hipóteses, com transições normais e primeira hipótese pelo teclado; outra rodada encerrada por derrota após oito hipóteses distintas. Ruído vencido em duas e encerrado por derrota após dez hipóteses distintas. Código revelado corretamente nos quatro resultados. Restante dos percursos usou Menos movimento. Evidências `public-sinal-win.png`, `public-sinal-loss.png`, `public-ruido-win.png`, `public-ruido-loss.png`.
- Número 999 aplicado por Sintonizar e depois 137 restaurado. Editar o campo para 999 e usar Repetir código conservou o código atual 137. P/Escape, manual reabrível, botões anterior/recente da fita e preferências conferidos. Histórico de duas rodadas/uma vitória por faixa preservado após reload; a tentativa reiniciou como documentado.
- Cinco arquivos públicos idênticos byte a byte ao build: HTML, favicon, licença, JS e CSS; 103.860 bytes totais. Bundle principal ~26,3 kB gzip. Sem garantia de FPS ou teste de hardware físico.
- Gitleaks 8.30.1 com configuração externa confiável sem achados no staged, histórico, export e clone remoto novo. Sem supressões locais. Secret scanning, push protection e alertas/atualizações de dependências gratuitos habilitados.
- API do GitHub confirmou somente `gustapaz` como contribuidor. Autor e committer `Gustavo Paz <96732649+gustapaz@users.noreply.github.com>`, sem coautor adicional. Licenças de dependências preservadas.
- Mensagens da extensão do navegador foram separadas dos erros do jogo; não foram identificadas violações CSP ou falhas do código do jogo durante as partidas públicas. Sem alegar console universalmente limpo.

## Limites

Sem telefone físico, Safari, gamepad, auditoria integral de leitor de tela ou garantia offline. Viewport móvel e clique de pointer não comprovam toque físico. Acessibilidade apoiada em DOM, rótulos, equivalentes textuais e foco; sem alegar conformidade integral. Sem garantia de disponibilidade/gratuidade permanente, FPS universal ou ausência absoluta de vulnerabilidades. Estatísticas locais são modificáveis, não ranking online. Tentativa atual não persiste após reload.
