# Configuración status-page (Upptime)

En **GitHub → gethu-ai/status-page → Settings**:

## Actions
- Workflow permissions: **Read and write**
- **Issues** habilitados

## Secret GH_PAT
PAT classic con `repo` + `workflow`.

## Slack (tres secrets)
| Secret | Valor |
|--------|--------|
| `NOTIFICATION_SLACK` | `true` |
| `NOTIFICATION_SLACK_WEBHOOK` | `true` |
| `NOTIFICATION_SLACK_WEBHOOK_URL` | URL Incoming Webhook |

Doc: https://upptime.js.org/docs/notifications

## Pages + dominio
- Pages desde **GitHub Actions**
- Dominio: **status.gethu.ai**
- DNS: CNAME `status` → `gethu-ai.github.io` → HTTPS

Ver: https://status.gethu.ai tras propagar DNS.

## Static Site CI (importante)

El workflow **Static Site CI** publica con **GitHub Actions** (`upload-pages-artifact` + `deploy-pages`), no con la rama `gh-pages`.  
Si la UI no cambiaba tras el job en verde, era porque Pages estaba en Actions pero el deploy iba solo a `gh-pages`. Ahora coinciden.

Tras cambiar `.upptimerc.yml`, ejecutá **Static Site CI** manualmente o esperá el cron diario.

**Nota:** el workflow semanal *Update Template* puede sobrescribir `site.yml`. Si vuelve el deploy viejo, restaurá este flujo o desactivá esa actualización.
