# Restore Missing Data Connect Configuration

The IDE is reporting a missing `dataconnect.yaml` error. Investigation shows that the `/services/dataconnect` directory is missing, but it is an intended part of the project architecture and a service named `zerocode` exists on the Firebase backend in `us-east4`.

## Proposed Changes

### Data Connect Service

#### [NEW] [dataconnect.yaml](file:///c:/Users/dgper/Proyectos/ZeroCode/services/dataconnect/dataconnect.yaml)

Create the main configuration file linking to the backend service.

#### [NEW] [schema.gql](file:///c:/Users/dgper/Proyectos/ZeroCode/services/dataconnect/schema/schema.gql)

Create a basic schema file.

#### [NEW] [connector.yaml](file:///c:/Users/dgper/Proyectos/ZeroCode/services/dataconnect/connector/connector.yaml)

Create a default connector configuration pointing to the local SDK directory used by the portfolio app.

## Verification Plan

### Manual Verification

- Check if the IDE error "Could not find dataconnect.yaml" disappears.
- Run `firebase dataconnect:services:list` again to ensure local and remote are synced.
