{{- define "project-management-app.name" -}}
{{ .Chart.Name }}
{{- end -}}

{{- define "project-management-app.fullname" -}}
{{ .Release.Name }}-{{ .Chart.Name }}
{{- end -}}
