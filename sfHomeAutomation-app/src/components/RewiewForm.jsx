import React from 'react';
import { Button, View, StyleSheet} from 'react-native';
import Text from './Text'
import {FormikInput, FormikInputLongText} from './FormikTextInput'
import { Formik } from 'formik';
import * as yup from 'yup';
import useReview from '../hooks/useReview';
import { useHistory } from 'react-router-native';


const initialValues = {
  repositoryOwnerName:'',
  repositoryName:'',
  repositoryRating:'',
  repositoryRewiew:'',
};

const styles = StyleSheet.create({
   flexItemA: {
    flexDirection: "column",
    marginLeft: 10,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 2,
    paddingBottom: 5,
   }
});

const validationSchema = yup.object().shape({
  repositoryOwnerName: yup
    .string()
    .required('Repository owner name is required'),
  repositoryName: yup
    .string()
    .required('Repository name is required'),
  repositoryRating: yup
    .number()
    .min(0, 'Rating must be between 0 and 100')
    .max(100, 'Rating must be between 0 and 100')
    .required('Rating is required'),
  repositoryReview: yup
    .string(),
});


const SubmitReviewForm = ({onSubmit}) => {
  
  return(
 <View style={styles.flexItemA}>
  
      <FormikInput name="repositoryOwnerName" placeholder="Repository owner name" />
 
      <FormikInput  name="repositoryName" placeholder="Repository name" />

        <FormikInput  name="repositoryRating" placeholder="Rating between 0 and 100" />

        <FormikInputLongText name="repositoryReview" placeholder="Review"/>
        
      <Button title="Create a review" onPress={onSubmit} >
        <Text fontWeight="bold"fontSize="subheading" color="white">Create a review</Text>
      </Button >
      </View>
  )}

const RewiewForm = () => {

const history = useHistory();
const [submitReview] = useReview();


const onSubmit = async (value) => {
  const ownerName = value.repositoryOwnerName
  const repositoryName = value.repositoryName
  const rating = parseInt(value.repositoryRating,10)
  const text = value.repositoryReview
  //console.log(username, password)

    try {
     const {data} = await submitReview({ repositoryName, ownerName, rating, text });
      console.log(data)
     history.push(`/repositories/${data.createReview.repositoryId}`)
    } catch (e) {
      console.log(e);
    }
  }

return (
    
     <Formik initialValues={initialValues}  onSubmit={onSubmit} validationSchema={validationSchema}>
    {({ handleSubmit }) => <SubmitReviewForm onSubmit={handleSubmit} />}
      </Formik>
    
  );
};
export default RewiewForm;