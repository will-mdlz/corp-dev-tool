const Button = styled.a`
  display: inline-block;
  padding: 15px 30px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  margin-top: 20px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const UploadButton = () => (
    <div className="upload-container">
      <Button 
        className="upload-button"
        onClick={() => {
          // Add your upload logic here
          console.log('Upload button clicked');
        }}
      >
        Upload Financial Data
      </Button>
    </div>
  );

export default UploadButton;