import React from 'react';
import { render } from '@testing-library/react-native';
import {renderItem} from './RepositoryItem';
import { FlatList, StyleSheet, View} from 'react-native';
import Text from './Text'

describe('RepositoryList', () => {
  describe('RepositoryListContainer', () => {
    it('renders repository information correctly', () => {
      const repositories = {
        pageInfo: {
          totalCount: 8,
          hasNextPage: true,
          endCursor:
            'WyJhc3luYy1saWJyYXJ5LnJlYWN0LWFzeW5jIiwxNTg4NjU2NzUwMDc2XQ==',
          startCursor: 'WyJqYXJlZHBhbG1lci5mb3JtaWsiLDE1ODg2NjAzNTAwNzZd',
        },
        edges: [
          {
            node: {
              id: 'jaredpalmer.formik',
              fullName: 'jaredpalmer/formik',
              description: 'Build forms in React, without the tears',
              language: 'TypeScript',
              forksCount: 1619,
              stargazersCount: 21856,
              ratingAverage: 88,
              reviewCount: 3,
              ownerAvatarUrl:
                'https://avatars2.githubusercontent.com/u/4060187?v=4',
            },
            cursor: 'WyJqYXJlZHBhbG1lci5mb3JtaWsiLDE1ODg2NjAzNTAwNzZd',
          },
          {
            node: {
              id: 'async-library.react-async',
              fullName: 'async-library/react-async',
              description: 'Flexible promise-based React data loader',
              language: 'JavaScript',
              forksCount: 69,
              stargazersCount: 1760,
              ratingAverage: 72,
              reviewCount: 3,
              ownerAvatarUrl:
                'https://avatars1.githubusercontent.com/u/54310907?v=4',
            },
            cursor:
              'WyJhc3luYy1saWJyYXJ5LnJlYWN0LWFzeW5jIiwxNTg4NjU2NzUwMDc2XQ==',
          },
        ],
      };

const RepositoryList = () => {
      const repositoryNodes = repositories.edges.map(edge => edge.node)
      //console.log(repositoryNodes)

  return (
      <FlatList
      data={repositoryNodes}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
    
  );
}
    const { getAllByTestId, debug } = render(<RepositoryList />);
//Should contain repository's name, description, language, forks count, stargazers count, rating average, and review count correctly.
 //   debug();


  const item1a = getAllByTestId('fullName')[0]
  const item1b= getAllByTestId('fullName')[1]
  const item2a = getAllByTestId('description')[0]
  const item2b = getAllByTestId('description')[1]
  const item3a = getAllByTestId('language')[0]
  const item3b = getAllByTestId('language')[1]
  const item4a = getAllByTestId('forks')[0]
  const item4b = getAllByTestId('forks')[1]
  const item5a = getAllByTestId('stars')[0]
  const item5b = getAllByTestId('stars')[1] 
  const item6a = getAllByTestId('rating')[0]
  const item6b = getAllByTestId('rating')[1]   
  const item7a = getAllByTestId('review')[0]
  const item7b = getAllByTestId('review')[1]   
  

  expect(item1a).toHaveTextContent('jaredpalmer/formik');
  expect(item2a).toHaveTextContent('Build forms in React, without the tears');
  expect(item3a).toHaveTextContent('TypeScript');
  expect(item4a).toHaveTextContent('1.6 k');
  expect(item5a).toHaveTextContent('21.9 k');
  expect(item6a).toHaveTextContent('88');
  expect(item7a).toHaveTextContent('3');

  expect(item1b).toHaveTextContent('async-library/react-async');
  expect(item2b).toHaveTextContent('Flexible promise-based React data loader');
  expect(item3b).toHaveTextContent('JavaScript');
  expect(item4b).toHaveTextContent('69');
  expect(item5b).toHaveTextContent('1.8 k');
  expect(item6b).toHaveTextContent('72');
  expect(item7b).toHaveTextContent('3');

    });
  });
});