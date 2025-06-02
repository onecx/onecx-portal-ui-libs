-- --keycloak
CREATE USER keycloak WITH ENCRYPTED PASSWORD 'keycloak';
CREATE DATABASE keycloak with owner keycloak;
GRANT ALL PRIVILEGES ON DATABASE keycloak TO keycloak;

-- --keycloak-public
CREATE USER keycloak_public WITH ENCRYPTED PASSWORD 'keycloak_public';
CREATE DATABASE keycloak_public with owner keycloak_public;
GRANT ALL PRIVILEGES ON DATABASE keycloak_public TO keycloak_public;

-- -- ###### ONECX #######
-- -- onecx_theme
CREATE USER onecx_theme WITH ENCRYPTED PASSWORD 'onecx_theme';
CREATE DATABASE onecx_theme;
GRANT ALL PRIVILEGES ON DATABASE onecx_theme TO onecx_theme;

-- -- onecx_workspace
CREATE USER onecx_workspace WITH ENCRYPTED PASSWORD 'onecx_workspace';
CREATE DATABASE onecx_workspace;
GRANT ALL PRIVILEGES ON DATABASE onecx_workspace TO onecx_workspace;

-- -- onecx_permission
CREATE USER onecx_permission WITH ENCRYPTED PASSWORD 'onecx_permission';
CREATE DATABASE onecx_permission;
GRANT ALL PRIVILEGES ON DATABASE onecx_permission TO onecx_permission;

-- -- onecx_product_store
CREATE USER onecx_product_store WITH ENCRYPTED PASSWORD 'onecx_product_store';
CREATE DATABASE onecx_product_store;
GRANT ALL PRIVILEGES ON DATABASE onecx_product_store TO onecx_product_store;

-- -- onecx_user_profile
CREATE USER onecx_user_profile WITH ENCRYPTED PASSWORD 'onecx_user_profile';
CREATE DATABASE onecx_user_profile;
GRANT ALL PRIVILEGES ON DATABASE onecx_user_profile TO onecx_user_profile;

-- -- onecx_tenant
CREATE USER onecx_tenant WITH ENCRYPTED PASSWORD 'onecx_tenant';
CREATE DATABASE onecx_tenant;
GRANT ALL PRIVILEGES ON DATABASE onecx_tenant TO onecx_tenant;

-- -- onecx_welcome
CREATE USER onecx_welcome WITH ENCRYPTED PASSWORD 'onecx_welcome';
CREATE DATABASE onecx_welcome;
GRANT ALL PRIVILEGES ON DATABASE onecx_welcome TO onecx_welcome;

-- -- onecx_help
CREATE USER onecx_help WITH ENCRYPTED PASSWORD 'onecx_help';
CREATE DATABASE onecx_help;
GRANT ALL PRIVILEGES ON DATABASE onecx_help TO onecx_help;

-- -- onecx_parameter
CREATE USER onecx_parameter WITH ENCRYPTED PASSWORD 'onecx_parameter';
CREATE DATABASE onecx_parameter;
GRANT ALL PRIVILEGES ON DATABASE onecx_parameter TO onecx_parameter;