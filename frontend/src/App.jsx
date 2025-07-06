import LectureForm from './components/pages/LectureForm';

<Route path="/lectures" element={<Lectures />} />
<Route path="/lectures/new" element={<LectureForm />} />
<Route path="/lectures/:id/edit" element={<LectureForm />} /> 