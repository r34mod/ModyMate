@echo off
setlocal enabledelayedexpansion

:: #############################################################################
:: # ModyMate AI Agent Skills Setup (Windows) - v2.0 (con menú interactivo)    #
:: #                                                                           #
:: # Este script configura el entorno para los asistentes de IA, incluyendo:   #
:: #  1. Un menú interactivo para seleccionar qué asistentes configurar.        #
:: #  2. Creación de enlaces simbólicos a la carpeta /skill.                  #
:: #  3. Copia de Agents.md a los archivos específicos de cada IA.            #
:: #                                                                           #
:: # IMPORTANTE: Debes ejecutar este script como Administrador.                #
:: #############################################################################

:: --- Definición de rutas y variables ---
set "PROJECT_ROOT=%~dp0.."
set "SKILLS_SOURCE_DIR=%~dp0"
set "AGENTS_FILE=%PROJECT_ROOT%\Agents.md"

set "SETUP_GEMINI=false"
set "SETUP_CLAUDE=false"
set "SETUP_CODEX=false"
set "SETUP_COPILOT=false"

:: --- Títulos y encabezados ---
:start
cls
echo =================================================
echo   Configurador de Skills para ModyMate (Windows)
echo =================================================
echo.

:: --- 1. Verificación de privilegios de administrador ---
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' NEQ '0' (
    echo ERROR: Se requieren privilegios de Administrador.
    echo Por favor, haz clic derecho sobre "setup.bat" y selecciona "Ejecutar como administrador".
    echo.
    pause
    exit /b 1
)

:: --- 2. Verificar que el archivo Agents.md existe ---
if not exist "%AGENTS_FILE%" (
    echo ERROR: No se encuentra el archivo principal "Agents.md" en la raiz del proyecto.
    echo.
    pause
    exit /b 1
)

:: --- 3. Menú Interactivo ---
set "opt1= "
set "opt2= "
set "opt3= "
set "opt4= "

:menu_loop
cls
echo Que asistentes de IA quieres configurar?
echo (Usa los numeros para activar/desactivar, 's' para seleccionar todos, 'n' para ninguno, 'c' para continuar)
echo.
echo  [%opt1%] 1. Gemini CLI
echo  [%opt2%] 2. Claude Code
echo  [%opt3%] 3. Codex (OpenAI)
echo  [%opt4%] 4. GitHub Copilot
echo.
set /p "choice=Opcion: "

if /i "%choice%"=="1" if "%opt1%"==" " (set "opt1=x") else (set "opt1= ")
if /i "%choice%"=="2" if "%opt2%"==" " (set "opt2=x") else (set "opt2= ")
if /i "%choice%"=="3" if "%opt3%"==" " (set "opt3=x") else (set "opt3= ")
if /i "%choice%"=="4" if "%opt4%"==" " (set "opt4=x") else (set "opt4= ")
if /i "%choice%"=="s" (set "opt1=x" & set "opt2=x" & set "opt3=x" & set "opt4=x")
if /i "%choice%"=="n" (set "opt1= " & set "opt2= " & set "opt3= " & set "opt4= ")

if /i not "%choice%"=="c" goto menu_loop

if "%opt1%"=="x" set "SETUP_GEMINI=true"
if "%opt2%"=="x" set "SETUP_CLAUDE=true"
if "%opt3%"=="x" set "SETUP_CODEX=true"
if "%opt4%"=="x" set "SETUP_COPILOT=true"

if not %SETUP_GEMINI%==true if not %SETUP_CLAUDE%==true if not %SETUP_CODEX%==true if not %SETUP_COPILOT%==true (
    echo.
    echo No se selecciono ningun asistente. No hay nada que hacer.
    pause
    exit /b 0
)

:: --- 4. Ejecutar configuraciones seleccionadas ---
echo.
echo Iniciando configuracion...
echo.

if %SETUP_GEMINI%==true call :setup_gemini
if %SETUP_CLAUDE%==true call :setup_claude
if %SETUP_CODEX%==true call :setup_codex
if %SETUP_COPILOT%==true call :setup_copilot

:: --- 5. Resumen Final ---
echo.
echo ==========================================================
echo    Configuracion completada con exito!
echo ==========================================================
echo.
echo Resumen de acciones:
if %SETUP_GEMINI%==true  echo   - Gemini:  Enlace a skills creado ^| Agents.md copiado a GEMINI.md
if %SETUP_CLAUDE%==true  echo   - Claude:  Enlace a skills creado ^| Agents.md copiado a CLAUDE.md
if %SETUP_CODEX%==true   echo   - Codex:   Enlace a skills creado.
if %SETUP_COPILOT%==true echo   - Copilot: Agents.md copiado a .github/copilot-instructions.md
echo.
echo Por favor, reinicia tus asistentes de IA para que carguen las nuevas skills.
echo.
pause
exit /b 0

:: -----------------------------------------------------------------------------
:: --- SUB-RUTINAS DE CONFIGURACION ---
:: -----------------------------------------------------------------------------

:setup_gemini
    echo [Configurando Gemini CLI...]
    call :create_symlink ".gemini"
    copy /Y "%AGENTS_FILE%" "%PROJECT_ROOT%\GEMINI.md" > nul
    echo   - Agents.md copiado a GEMINI.md
    echo.
goto :eof

:setup_claude
    echo [Configurando Claude Code...]
    call :create_symlink ".claude"
    copy /Y "%AGENTS_FILE%" "%PROJECT_ROOT%\CLAUDE.md" > nul
    echo   - Agents.md copiado a CLAUDE.md
    echo.
goto :eof

:setup_codex
    echo [Configurando Codex...]
    call :create_symlink ".codex"
    echo   - Codex usa Agents.md nativamente (no se necesita copia).
    echo.
goto :eof

:setup_copilot
    echo [Configurando GitHub Copilot...]
    set "COPILOT_DIR=%PROJECT_ROOT%\.github"
    set "COPILOT_FILE=%COPILOT_DIR%\copilot-instructions.md"
    if not exist "%COPILOT_DIR%" mkdir "%COPILOT_DIR%"
    copy /Y "%AGENTS_FILE%" "%COPILOT_FILE%" > nul
    echo   - Agents.md copiado a .github/copilot-instructions.md
    echo.
goto :eof

:create_symlink
    set "TOOL_CONFIG_DIR=%USERPROFILE%\%~1"
    set "LINK_PATH=%TOOL_CONFIG_DIR%\skills"
    
    if not exist "%TOOL_CONFIG_DIR%" mkdir "%TOOL_CONFIG_DIR%"
    if exist "%LINK_PATH%" rmdir /S /Q "%LINK_PATH%"
    
    echo   - Creando enlace simbolico en %LINK_PATH%
    mklink /D "%LINK_PATH%" "%SKILLS_SOURCE_DIR%" > nul
goto :eof