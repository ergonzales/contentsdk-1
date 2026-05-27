# escape=`

ARG PARENT_IMAGE
ARG SOLUTION_IMAGE
ARG TOOLS_IMAGE
ARG RAZL_CONNECTION_IMAGE

FROM ${RAZL_CONNECTION_IMAGE} as razl
FROM ${TOOLS_IMAGE} as tools
FROM ${PARENT_IMAGE}

SHELL ["powershell", "-Command", "$ErrorActionPreference = 'Stop'; $ProgressPreference = 'SilentlyContinue';"]

WORKDIR C:\inetpub\wwwroot

# Copy Razl connector files
COPY --from=razl c:\RazlService c:\inetpub\wwwroot
# Copy developer tools and entrypoint
COPY --from=tools C:\tools C:\tools