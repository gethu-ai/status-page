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
