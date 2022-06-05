import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const SearchBox = ({ history }) => {
  const [keyword, setKeyword] = useState('')

  const submitHandler = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      history.push(`/search/${keyword}`)
    } else {
      history.push('/')
    }
  }

  return (
    <Form onSubmit={submitHandler} inline>
      <Form.Control
        type='text'
        name='q'
        onChange={(e) => setKeyword(e.target.value)}
        placeholder={'Search...'}
        className='mr-sm-2 ml-sm-2 search-input' 
      ></Form.Control>
      <Button type='submit' variant='light' className='p-2 m-2'>
        Search
      </Button>
    </Form>
  )
}

export default SearchBox
