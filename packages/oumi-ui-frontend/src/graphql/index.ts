import { gql } from '@apollo/client';

export const FILE_OPEN_IN_EDITOR = gql`
  mutation fileOpenInEditor($input: OpenInEditorInput!) {
    fileOpenInEditor(input: $input)
  }
`;

export const QUERY_LAST_IMPORT_PATH = gql`
  query lastImportPath {
    lastImportPath
  }
`;
